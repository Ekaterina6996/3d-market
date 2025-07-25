import React, { useState, ChangeEvent } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import axios from 'axios';

interface CreateProjectProps {
    onProjectCreated: () => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ onProjectCreated }) => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) {
            setError('Please provide a title and select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('modelFile', file);

        try {
            setError('');
            setSuccess('');
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/projects', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuccess('Project created successfully!');
            setTitle('');
            setFile(null);
            // Notify parent to refetch projects
            onProjectCreated();
        } catch (err) {
            setError('Failed to create project.');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Create New Project</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
                <TextField 
                    fullWidth 
                    label="Project Title" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    margin="normal" 
                    required
                />
                <Button variant="contained" component="label" sx={{mt: 2}}>
                    Upload 3D Model
                    <input type="file" hidden onChange={handleFileChange} accept=".stl,.obj" />
                </Button>
                {file && <Typography sx={{display: 'inline', ml: 2}}>{file.name}</Typography>}
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, display: 'block' }}>Create Project</Button>
            </Box>
        </Paper>
    );
};

export default CreateProject;