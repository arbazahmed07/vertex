import { useState, useEffect } from 'react';
import Iframe from "react-iframe";
import "./docuCss.css";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Alert } from '@mui/material';

function DocumentVerification() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuth") === "true";
    if (!isAuthenticated) {
      navigate("/login");
    }
    
    // Set a timeout to handle cases where iframe might be blocked or fails to load
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError(true);
        setLoading(false);
      }
    }, 10000); // 10 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [navigate, loading]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setError(true);
    setLoading(false);
  };

  return (
    <div className="documentVerificationContainer">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Document Verification
      </Typography>
      
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading verification form...
          </Typography>
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          There was an error loading the verification form. Please try again later or contact support.
        </Alert>
      )}
      
      <div className="iframeContainer">
        <Iframe
          url="https://form.jotform.com/223367236310247"
          allowFullScreen
          frameBorder={0}
          className="iframe"
          title="DocumentVerification"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          position="relative"
          display={loading || error ? "none" : "block"}
        />
      </div>
      
      <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
        Please complete all required fields in the form. This information will be securely processed.
      </Typography>
    </div>
  );
}

export default DocumentVerification;
