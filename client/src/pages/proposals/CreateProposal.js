import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Entertainment',
  'Energy',
  'Real Estate',
  'Other'
];

function CreateProposal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [startups, setStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fundingGoal: '',
    equity: '',
    businessPlan: '',
    financialProjections: '',
    industry: '',
    timeline: ''
  });

  useEffect(() => {
    // Check if user is a startup founder
    const userRole = localStorage.getItem('role');
    if (userRole !== 'startup') {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Only startup founders can create proposals",
      });
      navigate('/');
      return;
    }

    // Fetch user's startups
    const fetchStartups = async () => {
      try {
        setLoading(true);
        const link = process.env.REACT_APP_API_URL || "http://localhost:4000";
        const userEmail = localStorage.getItem('user');
        
        if (!userEmail) {
          throw new Error("User not logged in");
        }
        
        console.log("Fetching startups for email:", userEmail);
        const response = await axios.get(`${link}/startups/fetchByFounder?email=${userEmail}`);
        
        if (response.data && response.data.startups) {
          console.log("Startups fetched:", response.data.startups);
          setStartups(response.data.startups);
        } else {
          console.log("No startups found or unexpected response format:", response.data);
          setStartups([]);
        }
      } catch (error) {
        console.error('Error fetching startups:', error);
        Swal.fire({
          icon: "warning",
          title: "No Startups Found",
          text: "You need to add a startup before creating a proposal",
          footer: '<a href="/add-startup">Add a startup now</a>'
        }).then(() => {
          navigate('/add-startup');
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleStartupChange = (e) => {
    setSelectedStartup(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const link = process.env.REACT_APP_API_URL;
      const userEmail = localStorage.getItem('user');
      const userName = localStorage.getItem('name');

      // Get the selected startup details
      const startup = startups.find(s => s._id === selectedStartup);
      
      if (!startup) {
        throw new Error('Please select a startup');
      }

      const proposalData = {
        title: formData.title,
        startupId: selectedStartup,
        founderEmail: userEmail,
        founderName: userName,
        description: formData.description,
        fundingGoal: parseFloat(formData.fundingGoal),
        equity: parseFloat(formData.equity),
        businessPlan: formData.businessPlan,
        financialProjections: formData.financialProjections,
        industry: formData.industry,
        timeline: formData.timeline
      };

      const response = await axios.post(`${link}/proposals/create`, proposalData);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your investment proposal has been submitted for review",
        });
        navigate('/my-proposals');
      }
    } catch (error) {
      console.error('Error creating proposal:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to submit proposal. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create Investment Proposal
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                required
                fullWidth
                label="Select Startup"
                value={selectedStartup}
                onChange={handleStartupChange}
                helperText="Select the startup for this proposal"
                margin="normal"
              >
                {startups.map((startup) => (
                  <MenuItem key={startup._id} value={startup._id}>
                    {startup.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Proposal Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Proposal Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
                helperText="Describe your business, market opportunity, and how the funds will be used"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Funding Goal"
                name="fundingGoal"
                type="number"
                value={formData.fundingGoal}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                helperText="Amount needed in dollars"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Equity Offered"
                name="equity"
                type="number"
                value={formData.equity}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{ min: 0, max: 100 }}
                helperText="Percentage of company offered"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                required
                fullWidth
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                margin="normal"
              >
                {industries.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                margin="normal"
                helperText="Expected timeline for using funds (e.g., '12 months')"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Plan URL"
                name="businessPlan"
                value={formData.businessPlan}
                onChange={handleChange}
                margin="normal"
                helperText="Link to your business plan document (optional)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Financial Projections URL"
                name="financialProjections"
                value={formData.financialProjections}
                onChange={handleChange}
                margin="normal"
                helperText="Link to your financial projections document (optional)"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? "Submitting..." : "Submit Proposal"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default CreateProposal;