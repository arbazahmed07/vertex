import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

function Home() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [proposalsAnchorEl, setProposalsAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const proposalsOpen = Boolean(proposalsAnchorEl);
  const userRole = localStorage.getItem("role");
  
  const isVerified = localStorage.getItem("isAuth") === "true";
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProposalsClick = (event) => {
    setProposalsAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleProposalsClose = () => {
    setProposalsAnchorEl(null);
  };
  
  const handleLogout = () => {
    localStorage.clear();
    handleClose();
    navigate("/login");
  };
  
  const handleProfileClick = () => {
    navigate("/profile");
    handleClose();
  };
  
  const handleEditProfileClick = () => {
    navigate("/editprofile");
    handleClose();
  };
  
  // Navigation functions for proposals
  const handleBrowseProposals = () => {
    navigate("/proposals");
    handleProposalsClose();
  };
  
  const handleMyProposals = () => {
    navigate("/my-proposals");
    handleProposalsClose();
  };
  
  const handleCreateProposal = () => {
    navigate("/create-proposal");
    handleProposalsClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Investment Marketplace
          </Typography>
          <Box sx={{ flexGrow: 1 }} />

          {/* Only show these if user is logged in */}
          {isVerified && (
            <>
              <Button color="inherit" onClick={() => navigate('/invSearchBar')}>
                Investors
              </Button>
              <Button color="inherit" onClick={() => navigate('/startupSearchBar')}>
                Startups
              </Button>
              <Button color="inherit" onClick={() => navigate('/chat')}>
                Chat
              </Button>
              <Button color="inherit" onClick={() => navigate('/hub')}>
                Knowledge Hub
              </Button>
              
              {/* Investment Proposals Dropdown */}
              <Button 
                color="inherit" 
                onClick={handleProposalsClick}
                endIcon={<DescriptionIcon />}
              >
                Proposals
              </Button>
              <Menu
                anchorEl={proposalsAnchorEl}
                open={proposalsOpen}
                onClose={handleProposalsClose}
                onClick={handleProposalsClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleBrowseProposals}>
                  <ListItemIcon>
                    <FormatListBulletedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Browse Proposals</ListItemText>
                </MenuItem>
                
                {userRole === 'startup' && [
                  <MenuItem key="my-proposals" onClick={handleMyProposals}>
                    <ListItemIcon>
                      <DescriptionIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>My Proposals</ListItemText>
                  </MenuItem>,
                  <MenuItem key="create-proposal" onClick={handleCreateProposal}>
                    <ListItemIcon>
                      <AddCircleOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Create New Proposal</ListItemText>
                  </MenuItem>
                ]}
              </Menu>
              
              {/* Role-specific buttons */}
              {userRole === 'startup' && (
                <Button color="inherit" onClick={() => navigate('/add-startup')}>
                  Add Startup
                </Button>
              )}
              
              {userRole === 'investor' && (
                <Button color="inherit" onClick={() => navigate('/add-investor')}>
                  Add Investor Profile
                </Button>
              )}
              
              {userRole === 'admin' && (
                <Button color="inherit" onClick={() => navigate('/admin-dashboard')}>
                  Admin Dashboard
                </Button>
              )}
            </>
          )}
          
          {/* Login/Signup or Profile Menu */}
          {isVerified ? (
            <>
              <Button
                color="inherit"
                id="profile-button"
                aria-controls={open ? "profile-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                {localStorage.getItem("name") || "Profile"}
              </Button>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "profile-button",
                }}
              >
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleEditProfileClick}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/signup")}>
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Home;
