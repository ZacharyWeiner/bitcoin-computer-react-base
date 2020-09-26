import React, {useState, useEffect} from "react";
import {Button, TextField, Card, Grid} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Computer from 'bitcoin-computer'
import * as Constants from './../constants/LocalStorageConstants'



export default function SendSatoshis() {
   const [address, setAddress] = useState('')
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
        

      } catch (err) {
        if(err.message.startsWith('Insufficient balance in address'))
          alert('You have to fund your wallet https://faucet.bitcoincloud.net/')
        else{
          console.log(err)
        }
      }
      setLoading(false)

    }
    const useStyles = makeStyles({
      root: {
        minWidth: 275,
      },
      bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
      },
      title: {
        fontSize: 14,
      },
      pos: {
        marginBottom: 12,
      },
    });
  const classes = useStyles()
  return (
  <div>
    <Grid container >
      <Grid item xs={12} md={6} >
      <h1 >Send Satoshis</h1>
      <h5 className="center"> {balance} satoshis <br/> Address: <br/>{address} <br />for Public Key: <br />{publicKey}</h5>
      <h2> How Do I Get Started? </h2>

      <h4> How To Create An Account on Bitcoin </h4>
      <p>To get started with Bitcoin and smart contracts, the first thing you need is an Account. On Bitcoin, you use a 12 word seed phrase a kind of a 'pssword' for your account. 
        <br/><br />Use the button below to generate a new Account &amp; Seed Phrase.</p>
      <p><Button variant="contained" color="primary" href="http://accounts.protoshi.com" target="_blank" rel="noopener noreferrer"> Get Your Passphrase Here </Button></p>
      <h6> Write Down Your Seed Phrase. Your Seed is YOUR Responsibility. </h6>  
      <h4> Get Some Bitcoin To Use In These Apps</h4>
        
        <p>Now that you have an Account, we need to fill it with some Bitcoin. <br/>To make this demo free, this website runs on top of bitcoin's test network. </p>
      </Grid>
      <Grid align='center' item xs={12} md={6} style={{paddingTop:"125px"}}>
        <Grid container>
        <Grid item xs={2} className="center"></Grid>
        <Grid item xs={8} className="center">
          <Card variant="outlined" className="center">
            <form onSubmit={send} >
              <h4 >Send {amount} Satoshis </h4>
              <TextField name="amount" defaultValue={amount}  onBlur={handleBlur} className={classes.root} fullWidth/>
              <h4> To Address:</h4>
              <div>
                <TextField name="sendToAddress" defaultValue={sendTo}  onBlur={handleBlur} className={classes.root} fullWidth/>
              </div>
              <br/>
              <Button variant="contained" color="primary"  type="submit" >
                Send Satoshis With Bitcoin Computer 
              </Button>
            </form>
          </Card>
        </Grid>
        <Grid item xs={2} className="center"></Grid>
      </Grid>
      <br/>
      <Grid container>
      <Grid item xs={2} className="center"></Grid>
        <Grid item xs={8}>
        {loading === true && (
          <Grid xs={12}>
          <h3>Loading...</h3>
          </Grid>
        )}
          {chainLink !== '' && (
            <Card>
              <h5>Transaction ID:</h5>
              <br/>
              {txID}
              <br/>
              <br/>
              <Button href={chainLink} target="_blank" variant="contained" color="secondary">
                Find This Transaction On Chain
              </Button>
            </Card>
          )}
        </Grid>
        <Grid item xs={2} className="center"></Grid>
      </Grid>
      </Grid>
    </Grid>
  

   
  </div>
  )
}

