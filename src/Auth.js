import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const Auth = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    const url = isLogin ? 'http://localhost:3001/users/login' : 'http://localhost:3001/users/register';
    try {
      const response = await axios.post(url, { username, password, role });
      if (isLogin) {
        setToken(response.data.access_token);
      } else {
        alert('Registration successful. Please log in.');
        setIsLogin(true);
      }
    } catch (error) {
      alert('Authentication failed');
    }
  };

  return (
    <Box p={3} maxWidth="400px" mx="auto" mt={5}>
      <Typography variant="h4" gutterBottom>{isLogin ? 'Login' : 'Register'}</Typography>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      {!isLogin && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="consultant">Consultant</MenuItem>
          </Select>
        </FormControl>
      )}
      <Button variant="contained" color="primary" onClick={handleAuth} fullWidth>
        {isLogin ? 'Login' : 'Register'}
      </Button>
      <Button color="secondary" onClick={() => setIsLogin(!isLogin)} fullWidth>
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </Button>
    </Box>
  );
};

export default Auth;
