import React, {useState, useEffect} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route, 
  useHistory
} from "react-router-dom";
import Computer from "bitcoin-computer"
import Home from './pages/Home.js'
import About from './pages/About.js'
import SendSatoshis from './pages/SendSatoshis.js'
import NonFungibleToken from './pages/NonFungibleToken.js'
import Voteables from './pages/Voteables.js'
import RockPaperScisors from './pages/RockPaperScisors.js'
import VoteableDetails from './pages/VoteableDetails.js'
import LocalStorageConstants from './constants/LocalStorageConstants.js'
import Login from './pages/Login'
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Button, Toolbar, Typography} from '@material-ui/core'

export default function App() {
  const [logged_in, setLoggedIn] = useState(false)
  const [computer, setComputer] = useState(null)

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
  const history = useHistory()
  const loggedIn = () => {
    let seed = window.localStorage.getItem(LocalStorageConstants.seed)
    return (seed != null && seed.length > 20)
  }

 

  
  useEffect(() => {
    
    const setUpComputer = async () => {
      let seed = window.localStorage.getItem(LocalStorageConstants.seed)
      if(seed === null){return null}
      let _computer  = new Computer({
        seed: seed,
        chain: "BSV", // BSV or BCH
        network: "testnet", // testnet or livenet
        path: "m/44'/0'/0'/0" // defaults to "m/44'/0'/0'/0"
        })
        setComputer(_computer)
    }
    setLoggedIn(loggedIn())
    if(loggedIn()){
      setUpComputer()
    }
  }, [])
  const logout = ()=> {
    window.localStorage.clear()
  }
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
            <Button variant="contained" color="primary" href="/rock-paper-scisors" className={classes.link}>
              Basic Game
            </Button>
            <Button variant="contained" color="primary" href="/votables" className={classes.link}>
              Votables
            </Button> 
          </nav>
          {logged_in ? (
            <Button onClick={logout} color="primary" variant="outlined" className={classes.link}>
              Logout
            </Button>
          ):(
            <Button href="/login" color="primary" variant="outlined" className={classes.link}>
            Login
            </Button>
          )}
          
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
          <Route path="/rock-paper-scisors">
            <RockPaperScisors />
          </Route>
          <Route path="/votables">
            <Voteables />
          </Route>
          <Route path="/voteable/:id" >
            <VoteableDetails />
          </Route>
          <Route path="/login" >
            <Login />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

