import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          My Post App
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/create-post">
          Create Post
        </Button>
        <Button color="inherit" component={Link} to="/posts">
          View Posts
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
