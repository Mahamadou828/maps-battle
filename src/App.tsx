import { Grid, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { SnackbarProvider } from "notistack";
import React from "react";
import "./App.css";
import { AppleMaps } from "./maps/apple/Maps";
import { HereMaps } from "./maps/here/Maps";

function App() {
  return (
    <SnackbarProvider>
      <div className="App">
        <Paper
          sx={{
            mx: "70px",
            my: "20px",
          }}
        >
          <Typography variant="h3">Maps Battle</Typography>
        </Paper>
        <Grid container spacing={2} sx={{ mb: "25px" }}>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            item
            xs={5}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/HERE_logo.svg/1200px-HERE_logo.svg.png"
              style={{
                maxWidth: "100px",
                marginRight: "30px",
              }}
              alt="Here logo"
            />
            <Typography variant="h4">Here</Typography>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            item
            xs={2}
          >
            <Typography variant="h4">VS</Typography>
          </Grid>
          <Grid
            item
            xs={5}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">Apple</Typography>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/488px-Apple_logo_black.svg.png"
              style={{
                width: "50px",
                height: "60px",
                marginLeft: "30px",
              }}
              alt="Apple logo"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <HereMaps />
          </Grid>
          <Grid item xs={6}>
            <AppleMaps />
          </Grid>
        </Grid>
      </div>
    </SnackbarProvider>
  );
}

export default App;
