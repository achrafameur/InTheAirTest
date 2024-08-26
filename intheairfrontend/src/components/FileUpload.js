import React, { useState, useRef } from 'react';
import { Button, LinearProgress, Box, Typography, TextField } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/Upload';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const UploadButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
}));

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadCompleted, setUploadCompleted] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadFile = async () => {
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        const chunkSize = 5 * 1024 * 1024; // 5MB chunk size
        const totalChunks = Math.ceil(file.size / chunkSize);
        setUploading(true);
        setUploadCompleted(false); // Reset upload completion state

        let uploadedChunks = 0;

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const start = chunkIndex * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);

            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('chunkIndex', chunkIndex);
            formData.append('totalChunks', totalChunks);
            formData.append('fileName', file.name);

            try {
                await axios.post('http://127.0.0.1:8000/api/upload-chunk/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            ((chunkIndex * chunkSize + progressEvent.loaded) / file.size) * 100
                        );
                        setUploadProgress(percentCompleted);
                    },
                });

                uploadedChunks += 1;

                if (uploadedChunks === totalChunks) {
                    setUploadCompleted(true);
                    setUploading(false);
                    setFile(null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = null;
                    }
                }
            } catch (error) {
                console.error(`Upload failed for chunk ${chunkIndex + 1}:`, error);
                setUploading(false);
                break;
            }
        }
    };

    const handleViewFiles = () => {
        navigate('/file-list');
    };

    return (
        <Box sx={{ maxWidth: 500, margin: 'auto', padding: 3 }}>
            <Typography variant="h6" gutterBottom>
                Télécharger un fichier
            </Typography>
            <TextField
                type="file"
                fullWidth
                inputRef={fileInputRef}
                onChange={handleFileChange}
                sx={{ marginBottom: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <UploadButton
                    variant="contained"
                    color="primary"
                    onClick={uploadFile}
                    startIcon={<FileUploadIcon />}
                    disabled={uploading}
                    fullWidth
                >
                    Télécharger
                </UploadButton>
                {uploading && (
                    <Box sx={{ width: '100%', marginTop: 2 }}>
                        <LinearProgress variant="determinate" value={uploadProgress} />
                        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                            Upload Progress: {uploadProgress}%
                        </Typography>
                    </Box>
                )}
                {uploadCompleted && (
                    <UploadButton
                        variant="contained"
                        color="secondary"
                        onClick={handleViewFiles}
                        fullWidth
                    >
                        Afficher les fichiers téléchargés
                    </UploadButton>
                )}
            </Box>
        </Box>
    );
};

export default FileUpload;

// import React, { useState } from 'react';
// import { Button, LinearProgress, Typography, Box, TextField } from '@mui/material';
// import FileUploadIcon from '@mui/icons-material/FileUpload';
// import { styled } from '@mui/material/styles';

// const UploadButton = styled(Button)(({ theme }) => ({
//     marginTop: theme.spacing(2),
// }));

// const FileUpload = () => {
//     const [file, setFile] = useState(null);
//     const [uploadProgress, setUploadProgress] = useState(0);

//     const handleFileChange = (event) => {
//         setFile(event.target.files[0]);
//     };

//     const uploadFile = async () => {
//         if (!file) {
//             alert("Please select a file first.");
//             return;
//         }

//         const chunkSize = 5 * 1024 * 1024; // 5MB chunk size
//         const totalChunks = Math.ceil(file.size / chunkSize);

//         let totalUploaded = 0;

//         for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
//             const start = chunkIndex * chunkSize;
//             const end = Math.min(start + chunkSize, file.size);
//             const chunk = file.slice(start, end);

//             const formData = new FormData();
//             formData.append('chunk', chunk);
//             formData.append('chunkIndex', chunkIndex);
//             formData.append('totalChunks', totalChunks);
//             formData.append('fileName', file.name);

//             try {
//                 const response = await fetch('http://127.0.0.1:8000/api/upload-chunk/', {
//                     method: 'POST',
//                     body: formData,
//                 });

//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }

//                 totalUploaded = Math.round(((chunkIndex + 1) / totalChunks) * 100);
//                 setUploadProgress(totalUploaded);

//                 console.log(`Chunk ${chunkIndex + 1} of ${totalChunks} uploaded successfully`);

//             } catch (error) {
//                 console.error(`Upload failed for chunk ${chunkIndex + 1}:`, error);
//                 break;
//             }
//         }
//     };

//     return (
//         <Box sx={{ maxWidth: 500, margin: 'auto', padding: 3 }}>
//             <Typography variant="h6">Upload File</Typography>
//             <TextField
//                 type="file"
//                 fullWidth
//                 onChange={handleFileChange}
//                 sx={{ marginBottom: 2 }}
//             />
//             <UploadButton
//                 variant="contained"
//                 color="primary"
//                 onClick={uploadFile}
//                 startIcon={<FileUploadIcon />}
//             >
//                 Upload
//             </UploadButton>
//             {uploadProgress > 0 && (
//                 <Box sx={{ marginTop: 2 }}>
//                     <LinearProgress variant="determinate" value={uploadProgress} />
//                     <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
//                         Upload Progress: {uploadProgress}%
//                     </Typography>
//                 </Box>
//             )}
//         </Box>
//     );
// };

// export default FileUpload;



// // FileUpload.js
