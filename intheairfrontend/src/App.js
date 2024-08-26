// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import { Container, Typography, Box } from '@mui/material';

const App = () => {
    return (
        <Router>
            <Container
                maxWidth="sm"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 4,
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom>
                        Système de téléchargement de fichiers
                    </Typography>
                </Box>
                <Routes>
                    <Route path="/" element={<FileUpload />} />
                    <Route path="/file-list" element={<FileList />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;
