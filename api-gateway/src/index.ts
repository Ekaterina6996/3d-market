import express from 'express';
import cors from 'cors';
import { expressjwt as jwt } from 'express-jwt';
import { userClient, projectClient } from './clients';

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.post('/auth/register', (req, res) => {
    userClient.Register(req.body, (err: any, response: any) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(response);
    });
});

app.post('/auth/login', (req, res) => {
    userClient.Login(req.body, (err: any, response: any) => {
        if (err) return res.status(401).json({ error: err.message });
        res.json(response);
    });
});

// Protected routes
// This middleware will check for a valid JWT in the Authorization header
app.use(jwt({ secret: 'your-super-secret-key-for-mvp', algorithms: ['HS256'] }));

app.get('/api/me', (req: any, res) => {
     userClient.GetUser({ id: req.auth.id }, (err: any, response: any) => {
        if (err) return res.status(404).json({ error: err.message });
        res.json(response);
    });
});

app.post('/api/projects', (req: any, res) => {
    const payload = { ...req.body, customerId: req.auth.id };
    projectClient.CreateProject(payload, (err: any, response: any) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(response);
    });
});

app.get('/api/projects', (req, res) => {
    projectClient.GetProjects({}, (err: any, response: any) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(response);
    });
});

app.listen(8080, () => {
    console.log('API Gateway running on http://localhost:8080');
});