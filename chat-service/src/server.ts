import { WebSocketServer } from 'ws';

interface Client {
  ws: any;
  userId: number;
  role: string;
}

const clients = new Map<number, Client>();
const PORT = process.env.PORT || 7000;

const wss = new WebSocketServer({ port: parseInt(PORT.toString()) });

wss.on('connection', (ws, req) => {
  // Extract token from query params
  const url = new URL(`http://dummy${req.url}`);
  const token = url.searchParams.get('token');
  
  if (!token) {
    ws.close(1008, 'Authentication required');
    return;
  }

  try {
    // Verify token (in real app use JWT_SECRET)
    const decoded = { userId: 1, role: 'client' }; 
    // For MVP skip actual verification
    
    const client: Client = {
      ws,
      userId: decoded.userId,
      role: decoded.role
    };
    
    clients.set(decoded.userId, client);
    
    ws.on('message', (message) => {
      handleMessage(message.toString(), client);
    });
    
    ws.on('close', () => {
      clients.delete(decoded.userId);
    });
    
    ws.send(JSON.stringify({ type: 'connected', message: 'Chat connected' }));
    
  } catch (error) {
    ws.close(1008, 'Invalid token');
  }
});

function handleMessage(message: string, sender: Client) {
  try {
    const data = JSON.parse(message);
    
    switch (data.type) {
      case 'message':
        const recipient = clients.get(data.recipientId);
        if (recipient) {
          recipient.ws.send(JSON.stringify({
            type: 'message',
            senderId: sender.userId,
            text: data.text,
            timestamp: new Date().toISOString()
          }));
        }
        break;
        
      default:
        console.log('Unknown message type:', data.type);
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
}

console.log(`Chat service running on ws://localhost:${PORT}`);