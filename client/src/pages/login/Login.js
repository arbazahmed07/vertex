import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Swal from 'sweetalert2';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

function Login({setIsAuthenticated}) {
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const user = new FormData(e.currentTarget);

    const userData = {
      email: user.get('email'),
      password: user.get('password'),
    };
    
    try {
      const link = process.env.REACT_APP_API_URL;
      
      // Better error handling for the login request
      const response = await axios.post(`${link}/users/login`, userData);
      
      // Add this right after receiving the response
      console.log('Server response:', response.data);

      // Replace the if block with this more resilient version
      if (response && response.status === 200) {
        // Get user details from the response or from a separate API call
        let userDetails;
        
        if (response.data && response.data.user) {
          // If the login response includes user data, use it
          userDetails = response.data.user;
        } else {
          // Otherwise, make a separate call to get user details
          const userResponse = await axios.get(`${link}/users/fetchUserByEmail/?email=${userData.email}`);
          if (userResponse.data && userResponse.data.length > 0) {
            userDetails = userResponse.data[0];
          } else {
            throw new Error("Could not fetch user details");
          }
        }
        
        // Now we can safely use userDetails
        localStorage.setItem("user", userData.email); // Use form data as fallback
        localStorage.setItem("name", userDetails.name || 'User');
        localStorage.setItem("key", userData.password);
        localStorage.setItem("addr", userDetails.address || '');
        localStorage.setItem("gender", userDetails.gender || '');
        
        // Store the role from the server response
        const userRole = userDetails.role || 'startup';
        localStorage.setItem("role", userRole);
        
        setIsAuthenticated(true);
        localStorage.setItem('isAuth', "true");
        
        Swal.fire({
          icon: "success",
          title: "Welcome back.....",
          text: `Hey! ${userDetails.name || 'User'} (${userRole})`,
        });

        navigate("/");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // More informative error message based on the error
      let errorMessage = "Something is not right. Try again!";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "User not found. Please check your email.";
        } else if (error.response.status === 401) {
          errorMessage = "Incorrect password. Please try again.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSignIn}>
            <TextField
              margin="dense"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoFocus
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              margin="dense"
            />
            <Button
              sx={{ mt: 2, mb: 1 }}
              type="submit"
              fullWidth
              variant="contained"
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link variant="body2" sx={{ ml: 12, mr: 1, mt:5 }} onClick={() => {
                  navigate("/signup");
                }}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}


export default Login;