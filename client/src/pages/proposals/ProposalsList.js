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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProposalsList() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const userRole = localStorage.getItem('role');
  const userEmail = localStorage.getItem('user');

  useEffect(() => {
    fetchProposals();
  }, [statusFilter, industryFilter]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const link = process.env.REACT_APP_API_URL;
      
      let queryParams = new URLSearchParams();
      if (statusFilter) queryParams.append('status', statusFilter);
      if (industryFilter) queryParams.append('industry', industryFilter);
      
      // If user is a startup founder, only show their proposals
      if (userRole === 'startup') {
        queryParams.append('founderEmail', userEmail);
      }
      
      const url = `${link}/proposals/fetchAll?${queryParams.toString()}`;
      const response = await axios.get(url);
      
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

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleIndustryFilterChange = (e) => {
    setIndustryFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter proposals based on search term
  const filteredProposals = proposals.filter(proposal => 
    proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proposal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proposal.founderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const renderEmptyState = () => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h6" color="text.secondary" paragraph>
        No proposals found matching your criteria
      </Typography>
      {userRole === 'startup' && (
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleCreateProposal}
        >
          Create New Proposal
        </Button>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Investment Proposals
        </Typography>
        
        {userRole === 'startup' && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateProposal}
          >
            Create New Proposal
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Proposals"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Under Review">Under Review</MenuItem>
                <MenuItem value="Negotiating">Negotiating</MenuItem>
                <MenuItem value="Funded">Funded</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Industry</InputLabel>
              <Select
                value={industryFilter}
                onChange={handleIndustryFilterChange}
                label="Industry"
              >
                <MenuItem value="">All Industries</MenuItem>
                <MenuItem value="Technology">Technology</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
                <MenuItem value="Retail">Retail</MenuItem>
                <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                <MenuItem value="Entertainment">Entertainment</MenuItem>
                <MenuItem value="Energy">Energy</MenuItem>
                <MenuItem value="Real Estate">Real Estate</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>Loading proposals...</Typography>
        </Box>
      ) : filteredProposals.length === 0 ? (
        renderEmptyState()
      ) : (
        <Grid container spacing={3}>
          {filteredProposals.map((proposal) => (
            <Grid item key={proposal._id} xs={12} md={6} lg={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {proposal.title}
                    </Typography>
                    <Chip 
                      label={proposal.status} 
                      color={getStatusColor(proposal.status)} 
                      size="small" 
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                    {proposal.description.length > 100 
                      ? `${proposal.description.substring(0, 100)}...` 
                      : proposal.description}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Funding Goal:</strong> ${proposal.fundingGoal.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Equity Offered:</strong> {proposal.equity}%
                    </Typography>
                    <Typography variant="body2">
                      <strong>Industry:</strong> {proposal.industry}
                    </Typography>
                    <Typography variant="body2">
                      <strong>By:</strong> {proposal.founderName}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => handleViewProposal(proposal._id)}
                  >
                    View Details
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

export default ProposalsList;