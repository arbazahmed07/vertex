import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Posts({ posts }) {
  const navigate = useNavigate();

  if (!posts || posts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography variant="h5">No startups found</Typography>
      </Box>
    );
  }

  const handleViewDetails = (id) => {
    // Navigate directly to the URL with the startup ID as a parameter
    navigate(`/startup/${id}`);
  };

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      {posts.map((post) => (
        <Grid item xs={12} sm={6} md={4} key={post._id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="140"
              image={post.photo && post.photo.length > 0 ? post.photo[0] : 'https://via.placeholder.com/150'}
              alt={post.name}
              sx={{ objectFit: 'contain', pt: 2 }}
              onClick={() => handleViewDetails(post._id)}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="div">
                {post.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Industry:</strong> {post.industries}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Location:</strong> {post.locations}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {post.description && post.description.length > 100 
                  ? `${post.description.substring(0, 100)}...` 
                  : post.description}
              </Typography>
              <Button 
                variant="contained" 
                size="small" 
                sx={{ mt: 2 }}
                onClick={() => handleViewDetails(post._id)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default Posts;
