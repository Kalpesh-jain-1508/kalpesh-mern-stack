 // eslint-disable-next-line

import React, { useState, useCallback } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const CustomerRegistration = () => {
  const [firstName, setFirstName] = useState('');
  const [message, setMessage] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validationSchema = yup.object({
    firstName: yup.string().trim().required('First Name is required'),
    lastName: yup.string().trim().required('Last Name is required'),
    email: yup.string().trim().email('Invalid email address').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    },
  });

  const onSubmit = useCallback(async data => {
    setMessage('');
    const { firstName, lastName, email, password } = data;

    const bodyData = { firstName, lastName, email, password, role: 'customer' };

    try {
        
        const registerUser = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register/customer`, bodyData, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
    
        if(registerUser?.data && registerUser?.data?.success) {
            setMessage(registerUser?.data?.message);
            toast.success('Please check mail for registration');
            reset();
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            
            setTimeout(() => setMessage(''), 10000);

        } else {
            toast.error(registerUser?.data?.message || "Registration failed");
        }
    } catch (error) {
        setMessage('');
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
        <Typography variant="h4" gutterBottom align="center">Customer Registration</Typography>
        {message && (
            <Typography variant='p' align='center' color='success'>{message}</Typography>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="First Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={firstName}
                onChange={(e) => {
                  field.onChange(e);
                  setFirstName(e.target.value);
                }}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Last Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={lastName}
                onChange={(e) => {
                  field.onChange(e);
                  setLastName(e.target.value);
                }}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName?.message}
              />
            )}
          />
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
            Register
          </Button>
        </form>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link href='/admin-registration' color="primary">Admin Registration</Link> or{' '}
            <Link href="/admin-login" color="primary">Admin Login</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default CustomerRegistration;
