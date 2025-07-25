import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// Extend Express Request type to include user
interface AuthRequest extends Request {
    user?: { userId: number, role: string };
}

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


const JWT_SECRET = process.env.JWT_SECRET || 'DEFAULT_SECRET';

// Auth Middleware (no changes needed)
const auth = (req: AuthRequest, res: Response, next: Function) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Access Denied: No Token Provided!');
    }
    const token = authHeader.split(' ')[1];
    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified as { userId: number, role: string };
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};

// File Upload Setup (no changes needed)
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// Create Project (no changes needed)
app.post('/', auth, upload.single('modelFile'), async (req: AuthRequest, res: Response) => {
    const { title } = req.body;
    const file = req.file;
    const ownerId = req.user?.userId;

    if (!file || !title || !ownerId) {
        return res.status(400).json({ message: "Title and file are required." });
    }

    const project = await prisma.project.create({
        data: {
            title,
            fileName: file.originalname,
            filePath: file.path,
            ownerId: ownerId,
            // Status is "open" by default
        },
    });
    res.status(201).json(project);
});

// Get Projects for logged-in Customer (no changes needed)
app.get('/', auth, async (req: AuthRequest, res: Response) => {
    const ownerId = req.user?.userId;
    const projects = await prisma.project.findMany({
        where: { ownerId: ownerId },
        orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
});

// --- NEW ENDPOINT: Get all OPEN projects for Makers ---
app.get('/open', auth, async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== 'Maker') {
        return res.status(403).json({ message: 'Access forbidden: Only Makers can view open projects.' });
    }

    const openProjects = await prisma.project.findMany({
        where: { status: 'open' },
        orderBy: { createdAt: 'desc' },
    });
    res.json(openProjects);
});

// --- NEW ENDPOINT: Maker accepts a project ---
app.post('/:projectId/accept', auth, async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== 'Maker') {
        return res.status(403).json({ message: 'Access forbidden: Only Makers can accept projects.' });
    }

    const projectId = parseInt(req.params.projectId, 10);
    const makerId = req.user.userId;

    try {
        const updatedProject = await prisma.project.update({
            where: { id: projectId, status: 'open' }, // Ensure we only update open projects
            data: {
                status: 'in_progress',
                makerId: makerId,
            },
        });
        res.json(updatedProject);
    } catch (error) {
        // This will fail if the project is not found or is not 'open', which is what we want.
        res.status(404).json({ message: 'Project not found or already taken.' });
    }
});


const PORT = 3002;
app.listen(PORT, () => console.log(`Project Service running on port ${PORT}`));