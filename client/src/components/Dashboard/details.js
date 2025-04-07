import * as React from "react";
import { Button, Box, Paper, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Details() {
  const navigate = useNavigate();

  const handleIncubators = () => {
    navigate("/startupSearchBar");
  };

  const handleInvestors = () => {
    navigate("/invSearchBar");
  };

  const handlePayment = () => {
    if (localStorage.getItem("isAuth") === "true") {
      navigate("/payments");
    } else {
      Swal.fire({
        icon: "error",
        title: "Hold onn.....",
        text: "Please Login",
      });
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item>
          <Paper
            elevation={3}
            sx={{
              width: 300,
              height: 300,
              p: 3,
              borderRadius: 3,
              textAlign: "center",
              backgroundColor: "white",
            }}
          >
            <Typography variant="h4" fontWeight={500} color="primary" pb={2}>
              Incubators
            </Typography>
            <Typography>
              Startup Incubators is a program that gives very early-stage companies access to mentorship, investors, and other support to help them get established.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ width: 150, fontSize: 16, mt: 4 }}
              onClick={handleIncubators}
            >
              Products
            </Button>
          </Paper>
        </Grid>
        <Grid item>
          <Paper
            elevation={3}
            sx={{
              width: 300,
              height: 300,
              p: 3,
              borderRadius: 3,
              textAlign: "center",
              backgroundColor: "white",
            }}
          >
            <Typography variant="h4" fontWeight={500} color="primary" pb={2}>
              Investors
            </Typography>
            <Typography>
              Impact investors make investments that help achieve certain social and environmental benefits while generating financial returns.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ width: 150, fontSize: 16, mt: 4 }}
              onClick={handleInvestors}
            >
              Investors
            </Button>
          </Paper>
        </Grid>
        <Grid item>
          <Paper
            elevation={3}
            sx={{
              width: 300,
              height: 300,
              p: 3,
              borderRadius: 3,
              textAlign: "center",
              backgroundColor: "white",
            }}
          >
            <Typography variant="h4" fontWeight={500} color="primary" pb={2}>
              Payment
            </Typography>
            <Typography>
              We provide several membership plans and different payment options for our customers. Check our payment page for more details.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ width: 150, fontSize: 16, mt: 4 }}
              onClick={handlePayment}
            >
              Payment
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
