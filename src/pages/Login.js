import React, {useState} from "react";
import {
  useHistory
} from "react-router-dom";
import Computer from 'bitcoin-computer'
import { Avatar, Box, Button, Grid, Card, Link, TextField, Typography, Container, CssBaseline } from '@material-ui/core'
import * as Constants from './../constants/LocalStorageConstants'
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Mnemonic from 'bsv/mnemonic'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {/* {'Copyright © '} */}
      <Link color="inherit" href="https://material-ui.com/">
        From: <br /> Artis International <br/> Protoshi <br/>@DevelopingZack
      </Link>{' '}
      {/* {new Date().getFullYear()}
      {'.'} */}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login({computer, setComputer, setLoggedIn}) {
  const [seed, setSeed] = useState('')
  const [username, setUsername] = useState('')
  let history = useHistory()
  let classes = useStyles()

  const handleChange = (e) => {
      if(e.target.name === 'username_box'){
        setUsername(e.target.value)
        window.localStorage.setItem(Constants.USERNAME, e.target.value)
      } else {
        let _seed = e.target.value 
        window.localStorage.setItem(Constants.SEED, e.target.value)
        setSeed(_seed)
      }
  }
  const handleClick = (e) => {
      e.preventDefault()
      computer = new Computer({
        seed: seed,
        chain: "BSV", 
        network: "testnet"
      })
      if(computer !== null){
        setLoggedIn(true)
        history.push('/home')
      }
  }
  
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username_box"
              label="Any Username You Like"
              name="username_box"
              autoFocus
              value={username} 
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="seed"
              label="Seed Phrase"
              type="text"
              id="seed"
              defaultValue={seed} 
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleClick}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Button variant='link' 
                  onClick={(e) => {
                    e.preventDefault()
                    const mn = Mnemonic.fromRandom(); 
                    window.localStorage.setItem(Constants.SEED, mn.toString())
                    alert("Please write down your seed as you will not be able to generate the same seed again.\n\n Your Seed Phrase is: \n\n" + mn.toString())
                    setSeed(mn.toString())
                    history.push('/send-satoshis')
                  }}>
                  {"Don't have an account? Get A Seed Phrase"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
    </div>
    )
}

export default Login
