import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Paper, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import axios from 'axios';

interface Project {
    id: number;
    title: string;
    fileName: string;
    createdAt: string;
    status: string;
}

const MakerDashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userName = localStorage.getItem('userName');

    const fetchOpenProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/api/projects/open', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(res.data);
        } catch (err) {
            setError('Failed to fetch projects.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpenProjects();
    }, []);

    const handleAcceptProject = async (projectId: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/api/projects/${projectId}/accept`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh the list after accepting
            fetchOpenProjects();
        } catch (err) {
            alert('Could not accept project. It might have already been taken.');
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/auth';
    };

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Maker Dashboard - Welcome, {userName}!
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <Paper elevation={3}>
                    <Typography variant="h5" sx={{ p: 2 }}>Available Projects</Typography>
                    <Divider />
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
                    ) : (
                        <List>
                            {projects.length === 0 && (
                                <ListItem>
                                    <ListItemText primary="No open projects available at the moment." />
                                </ListItem>
                            )}
                            {projects.map(p => (
                                <ListItem 
                                    key={p.id}
                                    secondaryAction={
                                        <Button 
                                            variant="contained" 
                                            onClick={() => handleAcceptProject(p.id)}
                                        >
                                            Accept
                                        </Button>
                                    }
                                    divider
                                >
                                    <ListItemText
                                        primary={p.title}
                                        secondary={`File: ${p.fileName} | Uploaded: ${new Date(p.createdAt).toLocaleDateString()}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default MakerDashboard;