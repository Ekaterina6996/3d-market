import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const PROTO_PATH = __dirname + '/protos/user.proto';
const JWT_SECRET = 'your-super-secret-key-for-mvp'; // In production, use environment variables

const prisma = new PrismaClient();

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true, longs: String, enums: String, defaults: true, oneofs: true
});
const userProto = grpc.loadPackageDefinition(packageDefinition).user as any;

const userService = {
    async Register(call: any, callback: any) {
        const { name, email, password, role } = call.request;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const user = await prisma.user.create({
                data: { name, email, password: hashedPassword, role }
            });
            callback(null, { id: user.id, name: user.name, email: user.email, role: user.role });
        } catch (e) {
            callback({ code: grpc.status.ALREADY_EXISTS, message: 'User already exists' });
        }
    },
    async Login(call: any, callback: any) {
        const { email, password } = call.request;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return callback({ code: grpc.status.NOT_FOUND, message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return callback({ code: grpc.status.UNAUTHENTICATED, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        callback(null, { token });
    },
    async GetUser(call: any, callback: any) {
         const { id } = call.request;
         const user = await prisma.user.findUnique({ where: { id } });
         if (!user) {
            return callback({ code: grpc.status.NOT_FOUND, message: 'User not found' });
        }
        callback(null, { id: user.id, name: user.name, email: user.email, role: user.role });
    }
};

function main() {
    const server = new grpc.Server();
    server.addService(userProto.UserService.service, userService);
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('User Service running on port:', port);
        server.start();

        // Run migrations
        const { exec } = require('child_process');
        exec('npx prisma db push', (err: any, stdout: any, stderr: any) => {
            if (err) {
                console.error(`exec error: ${err}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    });
}

main();