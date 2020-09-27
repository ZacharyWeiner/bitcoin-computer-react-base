import React, {useState, useEffect} from "react";
import { Avatar, Box, Button, Grid, Card, CardActions, Link, TextField, Typography, Container, CssBaseline } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Computer from 'bitcoin-computer'
import * as Constants from './../constants/LocalStorageConstants'
import SendIcon from '@material-ui/icons/Send'

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


export default function SendSatoshis() {
   const [address, setAddress] = useState('Not Logged In')
   const [computer, setComputer] = useState(null)
   const [balance, setBalance] = useState(0)
   const [sendTo, setSendTo] = useState('')
   const [amount, setAmount] = useState(0)
   const [chainLink, setChainLink] = useState('')
   const [loading, setLoading] = useState(false) 
   const [txID, setTXID] = useState('')
   const [publicKey, setPublicKey] = useState('')

   const handleBlur = async (e) => {
     if(e.target.name === 'sendToAddress'){
      setSendTo(e.target.value)
     }else if (e.target.name === "amount"){
       setAmount(e.target.value)
     }
   }
   useEffect(() => {
    const setUpComputer = async (seed) =>{
      const _computer = new Computer({
        seed: seed,
        chain: "BSV", // BSV or BCH
        network: "testnet" // testnet or livenet
        //path: "m/44'/0'/0'/0" // defaults to "m/44'/0'/0'/0"
      })
      setComputer(_computer)
      setAddress(await _computer.db.wallet.getAddress().toString())
      setBalance(await _computer.db.wallet.getBalance())
      setPublicKey(_computer.db.wallet.getPublicKey().toString())
      console.log('async initializing the  default computer')
    }
    let seed = window.localStorage.getItem(Constants.SEED)
    if(seed && computer === null){
      setUpComputer(seed)
    }

  }, [computer])
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
      <Grid item xs={12} md={6} className={ classes.darkPaperLeft}>
        <Typography component="h1" variant="h3">
          How Do I Get Started? 
        </Typography>
        <br />
        <Typography component="p"  className={classes.submit}>
          To get started with Bitcoin and smart contracts the first thing you need is an Account.<br />
          On Bitcoin, you use a 12 word seed phrase a kind of a usernam and password for your account. <br/>
          Your seed can be used in any application, not just this one. <br/>
          Any Coins, Tokens, Game Results or Votes that you create in this application can be used in any other Bitcoin application. 
          This principal is the foundation of data ownership. 
          <br/>This application does NOT own your data. You do. 
          <br/> No data is ever sent to our server and there is no database. This application runs exclusively in your browser, and stores all data on the blockchain. 
          <br/>You can bring it with you where ever you like. 
        </Typography>
        <h4> <span className="script big-number">1.</span>If You Dont Have A Seed Phrase To Use On The Test Network </h4>
        
          <Button variant="contained" color="primary" href="http://accounts.protoshi.com" target="_blank" rel="noopener noreferrer"> Get Your Seed Passphrase Here </Button>
        
        <h5> Write Down Your Seed Phrase. Your Seed is YOUR Responsibility. </h5> 

        <h4>  <span className="script big-number">2.</span>Login To This App</h4>
        <Button variant="contained" color="secondary" href="/login" target="_blank" rel="noopener noreferrer"> Login </Button>
        <br />
        <h4>  <span className="script big-number">3.</span>Get Some Bitcoin To Use In These Apps</h4>
        <p>Now that you have an Account, we need to fill it with some Bitcoin. 
          <br/>To make this demo free, this website runs on top of bitcoin's test network. 
        </p>
        <p> 
          Your Copy Your Address, and paste it in the text box on the page that launches when you click the button below<br/>
          Address: {address}
        </p>
        <Button variant="contained" color="primary" href="https://faucet.bitcoincloud.net" target="_blank" rel="noopener noreferrer"> Get Your Free Test Bitcoin Here </Button>
        
      </Grid>
      {/* Begin Right Side Form  */}
      <Grid align='center' item xs={12} md={6} style={{paddingTop:"125px"}}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <SendIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Send Satoshis
            </Typography>
            <Typography component="p" variant='p'>
              {balance} satoshis availble 
              <br />At your address:
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

