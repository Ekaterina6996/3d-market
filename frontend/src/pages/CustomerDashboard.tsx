import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';
import CreateProject from '../components/CreateProject';

interface Project {
    id: number;
    title: string;
    fileName: string;
    createdAt: string;
}

const CustomerDashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    const fetchProjects = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/projects', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(res.data);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        window.location.href = '/auth';
    };

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Customer Dashboard
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <CreateProject onProjectCreated={fetchProjects} />

                <Paper elevation={3} sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ p: 2 }}>My Projects</Typography>
                    <List>
                        {projects.map(p => (
                            <ListItem key={p.id} divider>
                                <ListItemText 
                                    primary={p.title}
                                    secondary={`File: ${p.fileName} - Uploaded: ${new Date(p.createdAt).toLocaleDateString()}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Container>
        </Box>
    );
};

export default CustomerDashboard;