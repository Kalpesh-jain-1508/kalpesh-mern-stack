 // eslint-disable-next-line
 import React, { useCallback, useState } from 'react';
 import { Controller, useForm } from 'react-hook-form';
 import { yupResolver } from '@hookform/resolvers/yup';
 import * as yup from 'yup';
 import { TextField, Button, Container, Box, Typography, Link } from '@mui/material';
 import axios from 'axios';
import { toast } from 'react-toastify';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const validationSchema = yup.object({
      email: yup.string().trim().email('Invalid email address').required('Email is required'),
      password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });
  
    const { handleSubmit, control, formState: { errors } } = useForm({
      resolver: yupResolver(validationSchema),
    });
  
    const onSubmit = useCallback(async data => {
      const { email, password } = data;

      try {
        
          const loginUser = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login/admin`, { email, password }, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          });
      
          if (loginUser?.data?.user?.role !== 'admin') {
            toast.error(loginUser.data.user.message);
            // alert('You are not allowed to login from here');
          } else {
            toast.success(loginUser?.data?.message);
          }
          setEmail('');
          setPassword('');
      } catch (error) {
        console.error("Error registering user:", error);
        if (error.response) {
            const errorMessage = error.response.data?.message || "Invalid request.";
            toast.error(errorMessage);
        }
      }
  
    });
  
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom align="center">Admin Login</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => {
                    field.onChange(e);
                    setEmail(e.target.value);
                  }}
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => {
                    field.onChange(e);
                    setPassword(e.target.value);
                  }}
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                />
              )}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>
          </form>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link href='/admin-registration' color="primary">Admin Registration</Link> or{' '}
            <Link href="/" color="primary">Customer Registration</Link>
          </Typography>
        </Box>
        </Box>
      </Container>
    );
  };
  
  export default AdminLogin;
  