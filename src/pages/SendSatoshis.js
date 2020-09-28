import React, {useState, useEffect} from "react";
import {useHistory} from 'react-router-dom'
import { Avatar, Box, Button, Grid, Card, CardActions, Link, TextField, Typography, Container, CssBaseline } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Computer from 'bitcoin-computer'
import * as Constants from './../constants/LocalStorageConstants'
import SendIcon from '@material-ui/icons/Send'
import Mnemonic from 'bsv/mnemonic'


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  darkPaperLeft: {
    padding: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    backgroundColor: '#000', color: '#fff'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }
}));


export default function SendSatoshis({setLoggedIn}) {
   const [seed, setSeed] = useState('')
   const [address, setAddress] = useState('Not Logged In')
   const [computer, setComputer] = useState(null)
   const [balance, setBalance] = useState(0)
   const [sendTo, setSendTo] = useState('')
   const [amount, setAmount] = useState(0)
   const [chainLink, setChainLink] = useState('')
   const [loading, setLoading] = useState(false) 
   const [txID, setTXID] = useState('')
   const [publicKey, setPublicKey] = useState('')
   let history = useHistory()

   const handleBlur = async (e) => {
     if(e.target.name === 'sendToAddress'){
      setSendTo(e.target.value)
     }else if (e.target.name === "amount"){
       setAmount(e.target.value)
     }
   }
   useEffect(() => {
    const setUpComputer = async (_seed) =>{
      const _computer = new Computer({
        seed: _seed,
        chain: "BSV", // BSV or BCH
        network: "testnet" // testnet or livenet
        //path: "m/44'/0'/0'/0" // defaults to "m/44'/0'/0'/0"
      })
      setComputer(_computer)
      setLoggedIn(true)
      let addr = await _computer.db.wallet.getAddress().toString()
      window.localStorage.setItem(Constants.DEFAULT_ADDRESS, addr)
      setAddress(await _computer.db.wallet.getAddress().toString())
      setBalance(await _computer.db.wallet.getBalance())
      setPublicKey(_computer.db.wallet.getPublicKey().toString())
      console.log('async initializing the  default computer')
    }
    let _seed = window.localStorage.getItem(Constants.SEED)
    console.log(_seed)
    if(_seed && computer === null){
      setUpComputer(_seed)
    }

  }, [computer, setLoggedIn])

  
    const generateSeed = async (e) =>{
      const mn = Mnemonic.fromRandom(); 
      let computer = new Computer({
        seed: mn.toString(),
        chain: "BSV", // BSV or BCH
        network: "testnet" // testnet or livenet
      })
      let addr = await computer.db.wallet.getAddress().toString()
      window.localStorage.setItem(Constants.SEED, mn.toString())
      window.localStorage.setItem(Constants.DEFAULT_ADDRESS, addr)
      setSeed(mn.toString())
      setAddress(addr.toString())
      setLoggedIn(true)
      
      
    }
    const send = async (e) => {
      try{
        e.preventDefault()
        setLoading(true)
       
       const {db } = computer 
       const { wallet } = db
        const address = wallet.getAddress()
        
        const addressString = address.toString()
        console.log(addressString)
        console.log(await wallet.getBalance())
        const pubKey =  wallet.getPublicKey()
        const revs = await computer.getRevs(pubKey)
        console.log(revs)
        console.log("Computer Initialized for Revisions of Contract or Token Type <>")
        let result = await computer.db.wallet.send(parseInt(amount, 10), sendTo);
        setTXID(result)
        alert(`1000 Satoshis Sent To \n ${sendTo} \n Transaction ID: \n ${result}`)
        setChainLink(`https://test.whatsonchain.com/tx/${result}`)
        setBalance(await computer.db.wallet.getBalance())
        

      } catch (err) {
        if(err.message.startsWith('Insufficient balance in address'))
          alert('You have to fund your wallet https://faucet.bitcoincloud.net/')
        else{
          console.log(err)
        }
      }
      setLoading(false)

    }
  const classes = useStyles()
  return (
  <div style={{height:"100%"}}>
    <Grid container >
      <Grid align='center' item xs={12} md={12} style={{paddingTop:"125px"}}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <SendIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Send Satoshis
            </Typography>
            <Typography component="p" variant='body1'>
              {balance} satoshis availble 
            </Typography>
            <Typography component="p" variant='body1'>
              At your address:
              <br />
              {address}
            </Typography>
            <form className={classes.form} noValidate  onSubmit={send}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="sendToAddress"
                label="Send To Address"
                name="sendToAddress"
                defaultValue={sendTo}  onBlur={handleBlur}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Amount"
                type="number"
                id="amount"
                name="amount" 
                defaultValue={sendTo}  
                onBlur={handleBlur}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Send Satoshis
              </Button>
            </form>
          </div>
        </Container>
        <Grid container>
          <Grid item xs={2} className="center"></Grid>
            <Grid item xs={8}>
              {loading === true && (
                <Grid xs={12}>
                <Typography variant="h2" componenet="h1">Sending...</Typography>
                </Grid>
              )}
              <br/>
              {chainLink !== '' && (
                <Card>
                  <Typography variant="h3" componenet="h1">Transaction ID:</Typography>
                  <br/>
                  <Typography variant="p" componenet="p"> {txID} </Typography>
                  <br/>
                  <CardActions>
                    <Button href={chainLink} target="_blank" variant="contained" color="secondary" fullWidth>
                      Find This Transaction On Chain
                    </Button>
                  </CardActions>
                  <br/>
                </Card>
              )}
            </Grid>
            <Grid item xs={2} className="center"></Grid>
          </Grid>
        </Grid>
        {/* End Right Side Form  */}
    </Grid>
  </div>
  )
}

