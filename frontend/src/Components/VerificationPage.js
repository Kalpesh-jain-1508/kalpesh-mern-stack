import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerificationPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isCalled, setIsCalled] = useState(false);
  
  const verifyEmail = async () => {
      try {
      setIsCalled(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/verify/${token}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Verification failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isCalled) return;
    verifyEmail();
  }, [isCalled, token]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Typography variant="h6" align="center" color="primary">
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default VerificationPage;
