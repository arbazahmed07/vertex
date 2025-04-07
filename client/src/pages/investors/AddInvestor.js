import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Swal from 'sweetalert2';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const theme = createTheme();

function AddInvestor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState('');

  const handlePhotoChange = (e) => {
  
    setPhoto(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const investor = new FormData(e.currentTarget);

    const investorData = {
      name: investor.get('name'),
      email: investor.get('email'),
      photo: [photo],
      field: investor.get('field'),
      contactNo: investor.get('contactNo'),
      totalInvestment: investor.get('totalInvestment') || "0"
    };

    const link = process.env.REACT_APP_API_URL;
    try {
      const response = await axios.post(`${link}/investors/add`, investorData);
      
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Investor added successfully",
        });
        navigate("/startups");  // Change this to your actual startup search page path
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add investor. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" sx={{ mb: 3 }}>
              Add New Investor
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Investor Name"
                    name="name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    id="photo"
                    label="Photo URL"
                    name="photo"
                    onChange={handlePhotoChange}
                    value={photo}
                    helperText="Enter URL of the investor's photo"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="field"
                    label="Investment Field"
                    id="field"
                    placeholder="Technology, Healthcare, Finance, etc."
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="contactNo"
                    label="Contact Number"
                    id="contactNo"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="totalInvestment"
                    label="Total Investment (CAD)"
                    id="totalInvestment"
                    type="number"
                    placeholder="0"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Adding Investor...' : 'Add Investor'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default AddInvestor;
