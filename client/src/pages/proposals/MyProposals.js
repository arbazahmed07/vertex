import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

function MyProposals() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const userEmail = localStorage.getItem('user');
  const userRole = localStorage.getItem('role');
  
  useEffect(() => {
    // Redirect if not a startup founder
    if (userRole !== 'startup') {
      navigate('/proposals');
      return;
    }
    
    fetchMyProposals();
  }, [userRole, navigate]);
  
  const fetchMyProposals = async () => {
    try {
      setLoading(true);
      const link = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${link}/proposals/fetchAll?founderEmail=${userEmail}`);
      
      if (response.data && response.data.proposals) {
        setProposals(response.data.proposals);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewProposal = (id) => {
    navigate(`/proposals/${id}`);
  };
  
  const handleCreateProposal = () => {
    navigate('/create-proposal');
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Draft': return 'default';
      case 'Under Review': return 'primary';
      case 'Negotiating': return 'warning';
      case 'Funded': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          My Proposals
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreateProposal}
        >
          Create New Proposal
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>Loading your proposals...</Typography>
        </Box>
      ) : proposals.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          You haven't created any proposals yet. Click "Create New Proposal" to get started!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {proposals.map((proposal) => (
            <Grid item key={proposal._id} xs={12}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {proposal.title}
                    </Typography>
                    <Chip 
                      label={proposal.status} 
                      color={getStatusColor(proposal.status)} 
                      size="medium" 
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {proposal.description.length > 150 
                      ? `${proposal.description.substring(0, 150)}...` 
                      : proposal.description}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2">
                        <strong>Funding Goal:</strong> ${proposal.fundingGoal.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2">
                        <strong>Equity Offered:</strong> {proposal.equity}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2">
                        <strong>Industry:</strong> {proposal.industry}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2">
                        <strong>Created:</strong> {moment(proposal.createdAt).format('MMM D, YYYY')}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  {proposal.status === 'Negotiating' && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Investors are making offers! Review them now.
                    </Alert>
                  )}
                  
                  {proposal.status === 'Funded' && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      Congratulations! Your proposal has been funded.
                    </Alert>
                  )}
                </CardContent>
                <Divider />
                <CardActions>
                  <Button 
                    size="medium" 
                    color="primary"
                    onClick={() => handleViewProposal(proposal._id)}
                  >
                    View Proposal
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default MyProposals;