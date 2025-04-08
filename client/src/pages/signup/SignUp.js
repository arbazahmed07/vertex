import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Swal from 'sweetalert2';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

const theme = createTheme();

function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState('startup'); // Default role

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const user = new FormData(e.currentTarget);

    const userData = {
      name: user.get('name'),
      email: user.get('email'),
      password: user.get('password'),
      gender: 'male',
      address: '',
      role: role // Add user role to the data
    };
    
    const link = process.env.REACT_APP_API_URL;
    const response = await axios
      .post(`${link}/users/signup`, userData)
      .catch((err) => {
        console.error(err);
      });

    try {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Yay! Profile created as " + role,
        });
        navigate("/login");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Hold on.....",
        text: "Something is not right. Try again!",
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" sx={{ mb:3 }}>
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSignUp}>
            <TextField
              margin="dense"
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoFocus
            />
            <TextField
              margin="dense"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              margin="dense"
            />
            
            {/* Add role selection */}
            <FormControl fullWidth margin="dense">
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role"
                value={role}
                label="Role"
                onChange={handleRoleChange}
              >
                <MenuItem value="startup">Startup Founder</MenuItem>
                <MenuItem value="investor">Investor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              sx={{ mt: 2, mb: 1 }}
              type="submit"
              fullWidth
              variant="contained"
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}


export default SignUp;