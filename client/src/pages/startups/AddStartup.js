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

function AddStartup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState('');

  const handlePhotoChange = (e) => {
    setPhoto(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get the founder's email from localStorage
      const founderEmail = localStorage.getItem('user');
      if (!founderEmail) {
        throw new Error("User not logged in");
      }

      const formData = new FormData(e.target);
      const startupData = {
        name: formData.get('name'),
        website: formData.get('website'),
        photo: photo,
        description: formData.get('description'),
        industries: formData.get('industries'),
        locations: formData.get('locations'),
        amountRaised: formData.get('amountRaised'),
        fundedOver: formData.get('fundedOver'),
        founderEmail: founderEmail // Make sure this is included
      };

      const link = process.env.REACT_APP_API_URL;
      console.log("Sending startup data:", startupData);
      const response = await axios.post(`${link}/startups/add`, startupData);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Startup added successfully",
        });
        navigate("/startupSearchBar"); // Navigate to startups search page
      }
    } catch (error) {
      console.error("Error adding startup:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add startup. Please try again.",
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
              Add New Startup
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Startup Name"
                    name="name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="website"
                    label="Website"
                    name="website"
                    type="url"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    id="photo"
                    label="Logo URL"
                    name="photo"
                    onChange={handlePhotoChange}
                    value={photo}
                    helperText="Enter URL of the startup's logo"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="description"
                    label="Description"
                    id="description"
                    multiline
                    rows={3}
                    placeholder="Brief description of the startup"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="industries"
                    label="Industries"
                    id="industries"
                    placeholder="Technology, Healthcare, Finance, etc."
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="locations"
                    label="Locations"
                    id="locations"
                    placeholder="City, Country"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="amountRaised"
                    label="Amount Raised (CAD)"
                    id="amountRaised"
                    type="text"
                    placeholder="0"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="fundedOver"
                    label="Funding Rounds"
                    id="fundedOver"
                    type="text"
                    placeholder="Pre-seed, Seed, Series A, etc."
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
                {loading ? 'Adding Startup...' : 'Add Startup'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default AddStartup;

