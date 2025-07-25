import express from 'express';
import multer from 'multer';
import { Pool } from 'pg';
import * as Minio from 'minio';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

// Database setup
const pool = new Pool({
  connectionString: process.env.DB_URL
});

// MinIO setup
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!
});

// Create bucket if not exists
minioClient.bucketExists(process.env.MINIO_BUCKET!, (err, exists) => {
  if (err) throw err;
  if (!exists) {
    minioClient.makeBucket(process.env.MINIO_BUCKET!, 'us-east-1', (err) => {
      if (err) console.error('Error creating bucket:', err);
      else console.log('Bucket created successfully');
    });
  }
});

// Middleware for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Middleware for authentication
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create tables
async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title VARCHAR(100) NOT NULL,
      filename VARCHAR(255) NOT NULL,
      material VARCHAR(50) NOT NULL,
      complexity VARCHAR(50) NOT NULL,
      cost NUMERIC(10,2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      project_id UUID NOT NULL REFERENCES projects(id),
      maker_id INTEGER NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

createTables();

// Create project endpoint
app.post('/projects', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const { title, material, complexity } = req.body;
    const userId = req.user.userId;
    const file = req.file;
    
    // File validation
    const ext = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
    if (!['.stl', '.obj'].includes(ext)) {
      return res.status(400).json({ error: 'Invalid file format. Only STL and OBJ are allowed' });
    }
    
    // Calculate cost (simplified)
    const fileSizeMB = file.size / (1024 * 1024);
    const materialCost = { PLA: 1, ABS: 1.5, PETG: 2 }[material] || 1;
    const complexityCost = { low: 1, medium: 1.5, high: 2 }[complexity] || 1;
    const cost = parseFloat((fileSizeMB * materialCost * complexityCost * 5).toFixed(2));
    
    // Generate unique ID
    const projectId = uuidv4();
    const filename = `${projectId}${ext}`;
    
    // Save to MinIO
    await minioClient.putObject(
      process.env.MINIO_BUCKET!,
      filename,
      file.buffer,
      file.size
    );
    
    // Save to database
    await pool.query(
      `INSERT INTO projects (id, user_id, title, filename, material, complexity, cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [projectId, userId, title, filename, material, complexity, cost]
    );
    
    res.status(201).json({ 
      id: projectId, 
      title, 
      cost,
      status: 'pending'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get projects endpoint
app.get('/projects', authenticate, async (req, res) => {
  try {
    const { role, userId } = req.user;
    let query = 'SELECT * FROM projects';
    let params: any[] = [];
    
    if (role === 'client') {
      query += ' WHERE user_id = $1';
      params = [userId];
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Core service running on port ${PORT}`);
});