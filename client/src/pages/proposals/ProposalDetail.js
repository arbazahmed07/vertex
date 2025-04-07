import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PercentIcon from '@mui/icons-material/Percent';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import userModel from '../../../../server/models/user';
function ProposalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [negotiateDialogOpen, setNegotiateDialogOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [counterOfferEquity, setCounterOfferEquity] = useState('');
  const [negotiationMessage, setNegotiationMessage] = useState('');
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const userRole = localStorage.getItem('role');
  const userEmail = localStorage.getItem('user');
  const userName = localStorage.getItem('name');
  
  useEffect(() => {
    fetchProposal();
    fetchComments();
  }, [id]);

  const fetchProposal = async () => {
    try {
      setLoading(true);
      const link = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${link}/proposals/${id}`);
      
      if (response.data && response.data.proposal) {
        setProposal(response.data.proposal);
      }
    } catch (error) {
      console.error('Error fetching proposal:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load proposal details. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const link = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${link}/proposals/comments/${id}`);
      
      if (response.data && response.data.comments) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    
    try {
      setCommentLoading(true);
      const link = process.env.REACT_APP_API_URL;
      
      // Get MongoDB user ID from backend
      const userResponse = await axios.get(`${link}/users/fetchUserByEmail/?email=${userEmail}`);
      const userId = userResponse.data[0]._id;
      
      const commentData = {
        proposalId: id,
        userId,
        userName,
        userEmail,
        userRole,
        content: commentText,
        isNegotiation: false
      };
      
      await axios.post(`${link}/proposals/comment`, commentData);
      
      setCommentText('');
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit comment. Please try again.",
      });
    } finally {
      setCommentLoading(false);
    }
  };

  const handleNegotiateOpen = () => {
    setNegotiateDialogOpen(true);
    setOfferAmount(proposal.fundingGoal.toString());
    setCounterOfferEquity(proposal.equity.toString());
    setNegotiationMessage('');
  };

  const handleNegotiateClose = () => {
    setNegotiateDialogOpen(false);
  };

  const handleNegotiateSubmit = async () => {
    try {
      setCommentLoading(true);
      const link = process.env.REACT_APP_API_URL;
      
      // Get MongoDB user ID from backend
      const userResponse = await axios.get(`${link}/users/fetchUserByEmail/?email=${userEmail}`);
      const userId = userResponse.data[0]._id;
      
      const negotiationData = {
        proposalId: id,
        userId,
        userName,
        userEmail,
        userRole,
        content: negotiationMessage,
        offerAmount: parseFloat(offerAmount),
        counterOfferEquity: parseFloat(counterOfferEquity),
        isNegotiation: true
      };
      
      await axios.post(`${link}/proposals/comment`, negotiationData);
      
      setNegotiateDialogOpen(false);
      fetchComments();
      fetchProposal();
    } catch (error) {
      console.error('Error submitting negotiation:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit negotiation. Please try again.",
      });
    } finally {
      setCommentLoading(false);
    }
  };

  const handleStatusOpen = () => {
    setNewStatus(proposal.status);
    setStatusUpdateDialogOpen(true);
  };

  const handleStatusClose = () => {
    setStatusUpdateDialogOpen(false);
  };

  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      const link = process.env.REACT_APP_API_URL;
      
      await axios.put(`${link}/proposals/updateStatus/${id}`, { status: newStatus });
      
      setStatusUpdateDialogOpen(false);
      fetchProposal();
      
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Proposal status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFundProposal = async () => {
    Swal.fire({
      title: 'Confirm Funding',
      text: "Are you sure you want to mark this proposal as funded? This indicates that you've agreed to invest in this startup.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, fund it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const link = process.env.REACT_APP_API_URL;
          await axios.put(`${link}/proposals/fund/${id}`);
          
          fetchProposal();
          
          Swal.fire(
            'Funded!',
            'The proposal has been marked as funded.',
            'success'
          );
        } catch (error) {
          console.error('Error funding proposal:', error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fund proposal. Please try again.",
          });
        }
      }
    });
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!proposal) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Proposal not found or you don't have permission to view it.
        </Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/proposals')}
        >
          Back to Proposals
        </Button>
      </Container>
    );
  }

  const isFounder = userEmail === proposal.founderEmail;
  const canNegotiate = userRole === 'investor' && 
    (proposal.status === 'Under Review' || proposal.status === 'Negotiating');
  const canUpdateStatus = (isFounder || userRole === 'admin') && proposal.status !== 'Funded';
  const canFund = userRole === 'investor' && 
    (proposal.status === 'Under Review' || proposal.status === 'Negotiating');

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/proposals')}
          sx={{ mb: 2 }}
        >
          Back to Proposals
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            {proposal.title}
          </Typography>
          <Chip 
            label={proposal.status} 
            color={getStatusColor(proposal.status)} 
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
        
        <Typography variant="subtitle1" color="text.secondary">
          By {proposal.founderName} • Created {moment(proposal.createdAt).format('MMMM D, YYYY')}
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Proposal Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {proposal.description}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Additional Documents
            </Typography>
            <Box sx={{ mt: 2 }}>
              {proposal.businessPlan && (
                <Button 
                  variant="outlined" 
                  href={proposal.businessPlan} 
                  target="_blank" 
                  sx={{ mr: 2, mb: 1 }}
                >
                  View Business Plan
                </Button>
              )}
              
              {proposal.financialProjections && (
                <Button 
                  variant="outlined" 
                  href={proposal.financialProjections} 
                  target="_blank"
                  sx={{ mb: 1 }}
                >
                  View Financial Projections
                </Button>
              )}
              
              {!proposal.businessPlan && !proposal.financialProjections && (
                <Typography variant="body2" color="text.secondary">
                  No additional documents provided.
                </Typography>
              )}
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Discussion & Negotiations
              </Typography>
              
              {comments.length > 0 ? (
                <List>
                  {comments.map((comment) => (
                    <React.Fragment key={comment._id}>
                      <ListItem alignItems="flex-start" sx={{
                        bgcolor: comment.isNegotiation ? 'rgba(255, 152, 0, 0.1)' : 'transparent',
                        borderRadius: 1
                      }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: comment.isNegotiation ? 'warning.main' : 'primary.main' }}>
                            {comment.userName.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography component="span" fontWeight="bold">
                                {comment.userName} ({comment.userRole})
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {moment(comment.createdAt).format('MMM D, YYYY [at] h:mm A')}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                                sx={{ display: 'block', mt: 1 }}
                              >
                                {comment.content}
                              </Typography>
                              
                              {comment.isNegotiation && (
                                <Box sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed' }}>
                                  <Typography variant="body2">
                                    <strong>Offer Amount:</strong> ${comment.offerAmount.toLocaleString()}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Equity Requested:</strong> {comment.counterOfferEquity}%
                                  </Typography>
                                </Box>
                              )}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
                  No comments or negotiations yet. Be the first to start the discussion!
                </Typography>
              )}
              
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Add a comment"
                  multiline
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={proposal.status === 'Funded' || proposal.status === 'Rejected'}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
                  {canNegotiate && (
                    <Button 
                      variant="outlined" 
                      color="warning"
                      onClick={handleNegotiateOpen}
                      disabled={commentLoading}
                    >
                      Make Offer
                    </Button>
                  )}
                  
                  <Button 
                    variant="contained" 
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim() || commentLoading || proposal.status === 'Funded' || proposal.status === 'Rejected'}
                  >
                    {commentLoading ? 'Sending...' : 'Post Comment'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Proposal Details
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <MonetizationOnIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Funding Goal" 
                    secondary={`$${proposal.fundingGoal.toLocaleString()}`} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PercentIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Equity Offered" 
                    secondary={`${proposal.equity}%`} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <CategoryIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Industry" 
                    secondary={proposal.industry} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <AccessTimeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Timeline" 
                    secondary={proposal.timeline} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <BusinessCenterIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Last Updated" 
                    secondary={moment(proposal.updatedAt).format('MMMM D, YYYY')} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {canUpdateStatus && userRole === "investor" && (
    <Button 
      variant="outlined" 
      color="primary" 
      fullWidth
      onClick={handleStatusOpen}
    >
      Update Status
    </Button>
  )}
            
            {canFund && (
              <Button 
                variant="contained" 
                color="success" 
                fullWidth
                onClick={handleFundProposal}
                startIcon={<AttachMoneyIcon />}
              >
                Fund This Proposal
              </Button>
            )}
            
            {proposal.status === 'Funded' && (
              <Alert severity="success" sx={{ mt: 2 }}>
                This proposal has been successfully funded!
              </Alert>
            )}
            
            {proposal.status === 'Rejected' && (
              <Alert severity="error" sx={{ mt: 2 }}>
                This proposal has been rejected.
              </Alert>
            )}
          </Box>
        </Grid>
      </Grid>
      
      {/* Negotiation Dialog */}
      <Dialog open={negotiateDialogOpen} onClose={handleNegotiateClose} maxWidth="sm" fullWidth>
        <DialogTitle>Make an Offer</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Investment Amount"
            type="number"
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            sx={{ mt: 2 }}
            helperText={`Original asking amount: $${proposal?.fundingGoal.toLocaleString()}`}
          />
          
          <TextField
            fullWidth
            label="Equity Requested (%)"
            type="number"
            value={counterOfferEquity}
            onChange={(e) => setCounterOfferEquity(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            sx={{ mt: 3 }}
            helperText={`Original equity offered: ${proposal?.equity}%`}
          />
          
          <TextField
            fullWidth
            label="Message to Founder"
            multiline
            rows={4}
            value={negotiationMessage}
            onChange={(e) => setNegotiationMessage(e.target.value)}
            sx={{ mt: 3 }}
            placeholder="Explain your offer terms and conditions..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNegotiateClose}>Cancel</Button>
          <Button 
            onClick={handleNegotiateSubmit} 
            color="primary" 
            variant="contained"
            disabled={!offerAmount || !counterOfferEquity}
          >
            Submit Offer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Status Update Dialog */}
      <Dialog open={statusUpdateDialogOpen} onClose={handleStatusClose}>
        <DialogTitle>Update Proposal Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            sx={{ mt: 2 }}
            SelectProps={{
              native: true,
            }}
          >
            <option value="Draft">Draft</option>
            <option value="Under Review">Under Review</option>
            <option value="Negotiating">Negotiating</option>
            <option value="Funded">Funded</option>
            <option value="Rejected">Rejected</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusClose}>Cancel</Button>
          <Button onClick={handleStatusUpdate} color="primary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ProposalDetail;