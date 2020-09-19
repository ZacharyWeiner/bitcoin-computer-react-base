import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './pages/Home.js'
import About from './pages/About.js'
import SendSatoshis from './pages/SendSatoshis.js'
import NonFungibleToken from './pages/NonFungibleToken.js'
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Button, Toolbar, Typography} from '@material-ui/core'

export default function App() {
  const useStyles = makeStyles((theme) => ({
    '@global': {
      ul: {
        margin: 0,
        padding: 0,
        listStyle: 'none',
      },
    },
    appBar: {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
      flexWrap: 'wrap',
    },
    toolbarTitle: {
      flexGrow: 1,
    },
    link: {
      margin: theme.spacing(1, 1.5),
    },
    heroContent: {
      padding: theme.spacing(8, 0, 6),
    },
    cardHeader: {
      backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    },
    cardPricing: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'baseline',
      marginBottom: theme.spacing(2),
    },
    footer: {
      borderTop: `1px solid ${theme.palette.divider}`,
      marginTop: theme.spacing(8),
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      [theme.breakpoints.up('sm')]: {
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(6),
      },
    },
  }));

  const classes = useStyles();
  
  return (
    <Router>
      <div>
      <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
            Bitcoin-Computer React-Base-App
          </Typography>
          <nav>
            <Button variant="contained" color="primary" href="/" className={classes.link}>
              Home
            </Button>
            <Button variant="contained" color="primary" href="/send-satoshis" className={classes.link}>
              Send Satoshis
            </Button>
            <Button variant="contained" color="primary" href="/non-fungible-token" className={classes.link}>
              Non Fungible Token
            </Button>
          </nav>
          <Button href="#" color="primary" variant="outlined" className={classes.link}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/send-satoshis">
            <SendSatoshis />
          </Route>
          <Route path="/non-fungible-token">
            <NonFungibleToken />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

