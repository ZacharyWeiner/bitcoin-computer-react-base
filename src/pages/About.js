import React, {useState, useEffect} from "react";
import {useHistory} from 'react-router-dom'
import { Avatar, Box, Button, Grid, Card, CardActions, Link, TextField, Typography, Container, CssBaseline } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Computer from 'bitcoin-computer'
import * as Constants from './../constants/LocalStorageConstants'
import SendIcon from '@material-ui/icons/Send'
import Mnemonic from 'bsv/mnemonic'
import BSV from 'bsv'


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
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export default function About({setLoggedIn}) {
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
      setSeed(_seed)
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
    const fundAddresses = async (e) => {
      setLoading(true)
      let paths = []
      let addresses = []
      paths.push(Constants.DEFAULT_PATH)
      paths.push(Constants.TOKENS_PATH)
      paths.push(Constants.NFT_PATH)
      paths.push(Constants.BASIC_VOTEABLE_PATH)

      paths.forEach(async (p)=>{
        let _computer = new Computer({
          seed: seed, 
          chain: "BSV",
          path: p
        })
        let addr = await _computer.db.wallet.getAddress()
        addresses.push(addr.toString())
        console.log('pushed address: ' + addr.toString() + ' for path '  + p)
      })
      let count = paths.length; 
      const storage_comp = await new Computer({
        seed: window.localStorage.getItem(Constants.SEED), 
        chain: "BSV"
      })
      
      console.log(addresses.length)
      let counter = addresses.length
      let i = 0
      addresses.forEach(async (a) =>{
        try{
        let _result = await storage_comp.db.wallet.send(parseInt(10000, 10), a);
        console.log(_result)
        await sleep(3000)
        await storage_comp.sync()
        }catch(err){
          console.log("Error: " + err.toString())
        }
      })
    }
    

    async function fundAddress(_path){
      setLoading(true)
      let _computer = new Computer({
        seed: seed, 
        chain: "BSV",
        path: _path
      })
      let addr = await _computer.db.wallet.getAddress()
      let sendFrom = new Computer({
        seed: window.localStorage.getItem(Constants.SEED),
        chain: "BSV", // BSV or BCH
        network: "testnet"
      })
      try{
        let tx = await sendFrom.db.wallet.send(parseInt(10000, 10), addr)
        setTXID(tx)
        setChainLink(`https://test.whatsonchain.com/tx/${tx}`)
        setBalance(await sendFrom.db.wallet.getBalance())
        
      }catch(err){
        alert (err)
      }
      setLoading(false)
    }

    const fundCoins = async (e) =>{
      await fundAddress(Constants.TOKENS_PATH)
    }

    const fundTokens = async (e) =>{
      await fundAddress(Constants.NFT_PATH)
    }

    const fundVotes = async (e) =>{
      await fundAddress(Constants.BASIC_VOTEABLE_PATH)
    }

    const fundElections = async (e) =>{
      await fundAddress(Constants.ELECTION_PATH)
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
      <Grid item xs={12} md={6} className={ classes.darkPaperLeft}>
        <Typography component="h1" variant="h3">
          How Do I Get Started? 
        </Typography>
        <br />
        <Typography component="p"  className={classes.submit}>
          To get started with Bitcoin and smart contracts the first thing you need is an Account.
          On Bitcoin, you use a 12 word seed phrase a kind of a usernam and password for your account. <br/>
          Your seed can be used in any application, not just this one. <br/><br/>
          Any Coins, Tokens, Game Results or Votes that you create in this application can be used in any other Bitcoin application. 
          This principal is the foundation of data ownership:
          <br/><br/><i>This application does NOT own your data. You do. </i><br/>
          <br/> No data is ever sent to our server and there is no database. This application runs exclusively in your browser, and stores all data on the blockchain. 
          <br/>You can bring it with you where ever you like. 
        </Typography>
        <Typography control='h2' variant='h5' > <span className="script big-number">1</span>- Get A Seed Phrase To Use On The Test Network </Typography>
        
          <Button variant="contained" color="primary" onClick={generateSeed} target="_blank" rel="noopener noreferrer"> Generate Your Seed </Button>
        
        <h5> Write Down Your Seed Phrase. Your Seed is YOUR Responsibility. </h5> 

        <br />
        <Typography control='h2' variant='h5' > <span className="script big-number">2</span>- Login To This App</Typography>
        {window.localStorage.getItem(Constants.SEED) === null 
        ? (<div> <Button variant="contained" color="secondary" href="/login" target="_blank" rel="noopener noreferrer" fullWidth> Login </Button></div>) 
        : (<Card>You Are Logged in With Seed: <br /> <Typography component='h2' variant='h5' style={{color:'blue'}}> {window.localStorage.getItem(Constants.SEED)} </Typography></Card>)}
        
        <br /><br />
        <Typography control='h2' variant='h5' > <span className="script big-number">3</span> - Get Some Bitcoin To Use In These Apps</Typography>
        <Typography control='p' variant='body1'>Now that you have an Account, we need to fill it with some Bitcoin. 
          <br/>To make these applications free, this website runs on top of bitcoin's test network. 
          </Typography>
          <br/>
          <Typography control='p' variant='body1'> 
           Copy Your Address, and paste it in the text box on the page that launches when you click the button below<br/>
          Address: 
        </Typography>
          {window.localStorage.getItem(Constants.DEFAULT_ADDRESS) === null 
          ? <div> Generate a seed to get an address </div>
          : <Card><Typography control='h2' variant='h5' >{address}</Typography></Card>}
          
          
        <Button variant="contained" color="primary" href="https://faucet.bitcoincloud.net" target="_blank" rel="noopener noreferrer"> Get Your Free Test Bitcoin Here </Button>
        <br/><br />
        <Typography control='h2' variant='h5' > <span className="script big-number">4</span>- Send Some Satoshis To The Other Addresses In Your Wallet</Typography>
        <Typography control='p' variant='body1' style={{marginLeft: "12px"}}>Your Seed phrase is like a password to your wallet. Your crypto wallet has different containers like the dividers in a real wallet. </Typography>
        <Typography control='p' variant='body1' style={{marginLeft: "24px"}}>
          <b>4.a</b> 
          - Click the  
          <Button variant="contained" color="default" href="/tokens" className={classes.link} target="_blank" style={{margin:"6px"}}>
              Coins &amp; Wallets
            </Button> 
           Button at the top of the page to launch the coins app in a new tab. </Typography>
        <Typography control='p' variant='body1' style={{marginLeft: "24px"}}><b>4.b</b> - Copy the Address from the top of the page </Typography>
        <Typography control='p' variant='body1' style={{marginLeft: "24px"}}><b>4.c</b> - Return to this tab, and send some satoshis to the address you copied in the previous step (4.b)</Typography>
        <Typography control='p' variant='body1' style={{marginLeft: "24px"}}><b>4.d</b> - Return to the coins tab (possibly refresh) to see your Coins App Address is now funded with the number of satoshis you sent </Typography>
        <Typography control='p' variant='body1' style={{marginLeft: "24px"}}><b>4.e</b> - Repeat steps 4.a - 4.d for the rest of the buttons in the navigation bar. </Typography>
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
            <Button
                onClick={fundCoins}
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
              >
                Send 10,000 Satoshis To Coins Wallet 
              </Button>
              <Button
                onClick={fundTokens}
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
              >
                Send 10,000 Satoshis To NFT Wallet 
              </Button>
              <Button
                onClick={fundVotes}
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
              >
                Send 10,000 Satoshis To Votables Wallet 
              </Button>
              <Button
                onClick={fundElections}
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
              >
                Send 10,000 Satoshis To Elections Wallet 
              </Button>
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

