import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,

  Divider,
  Tabs,
  Tab,

  Avatar
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [startups, setStartups] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const userRole = localStorage.getItem('role');
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }

    // Fetch data for admin dashboard
    const fetchData = async () => {
      try {
        setLoading(true);
        const link = process.env.REACT_APP_API_URL;
        
        // Get all users
        const usersResponse = await axios.get(`${link}/users/all`);
        setUsers(usersResponse.data.users || []);

        setStartups([]); 
        setInvestors([]); 
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Admin Dashboard
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
          <Tab label="Overview" />
          <Tab label="Users" />
          <Tab label="Startups" />
          <Tab label="Investors" />
        </Tabs>
      </Box>
      
      {/* Overview Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Users" />
              <CardContent>
                <Typography variant="h3">{users.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total registered users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Startups" />
              <CardContent>
                <Typography variant="h3">{startups.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Registered startups
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Investors" />
              <CardContent>
                <Typography variant="h3">{investors.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Registered investors
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Users Tab */}
      {tabValue === 1 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            User Management
          </Typography>
          <List>
            {users.map((user) => (
              <React.Fragment key={user._id}>
                <ListItem>
                  <Avatar sx={{ mr: 2 }}>{user.name ? user.name.charAt(0) : 'U'}</Avatar>
                  <ListItemText 
                    primary={user.name} 
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2" color="text.primary">
                          {user.email}
                        </Typography>
                        {` — Role: ${user.role}`}
                      </React.Fragment>
                    } 
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
      
      {/* Startups Tab */}
      {tabValue === 2 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Startup Management
          </Typography>
          {/* Display startups here */}
          <Typography variant="body1">
            {startups.length ? "List of startups" : "No startups found."}
          </Typography>
        </Paper>
      )}
      
      {/* Investors Tab */}
      {tabValue === 3 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Investor Management
          </Typography>
          {/* Display investors here */}
          <Typography variant="body1">
            {investors.length ? "List of investors" : "No investors found."}
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

export default AdminDashboard;