"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Button, Link } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link href="/" underline="none" color="inherit">
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Brain Diagnosis
          </Typography>
        </Link> 
      </Toolbar>
    </AppBar>
  );
}
