// FileList.js
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Container } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const FileList = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        // Fetch the list of files
        axios.get('http://127.0.0.1:8000/api/list-files/')
            .then(response => setFiles(response.data))
            .catch(error => console.error('Error fetching files:', error));
    }, []);

    const deleteFile = (fileId) => {
        axios.delete(`http://127.0.0.1:8000/api/delete-file/${fileId}/`)
            .then(() => {
                setFiles(files.filter(file => file.id !== fileId));
            })
            .catch(error => console.error('Error deleting file:', error));
    };

    return (
        <Container>
            <Typography variant="h6" gutterBottom>
                Fichiers téléchargés
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom</TableCell>
                            <TableCell>Taille</TableCell>
                            <TableCell>Date de téléchargement</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {files.map(file => (
                            <TableRow key={file.id}>
                                <TableCell>{file.name}</TableCell>
                                <TableCell>{file.size}</TableCell>
                                <TableCell>{new Date(file.upload_date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => deleteFile(file.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default FileList;
