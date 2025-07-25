import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Proxy routes
app.use('/api/users', createProxyMiddleware({ target: 'http://user-service:3001', changeOrigin: true }));
app.use('/api/projects', createProxyMiddleware({ target: 'http://project-service:3002', changeOrigin: true }));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});