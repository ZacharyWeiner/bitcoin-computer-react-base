import React, {useState, useEffect} from "react";
import {Button, TextField, Card, Grid} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Computer from 'bitcoin-computer'



export default function SendSatoshis() {
   const [computer, setComputer] = useState(null)
   const [balance, setBalance] = useState(0)
   const [sendTo, setSendTo] = useState('')
   const [amount, setAmount] = useState(0)
   const [chainLink, setChainLink] = useState('')
   const [loading, setLoading] = useState(false) 
   const [txID, setTXID] = useState('')

   const handleBlur = async (e) => {
     if(e.target.name === 'sendToAddress'){
      setSendTo(e.target.value)
     }else if (e.target.name === "amount"){
       setAmount(e.target.value)
     }
   }
   useEffect(() => {
    const setUpComputer = async () =>{
      const computer = new Computer({
        seed: "noble canal morning large era tonight fox river disagree home spider material",
        chain: "BSV", // BSV or BCH
        network: "testnet" // testnet or livenet
        //path: "m/44'/0'/0'/0" // defaults to "m/44'/0'/0'/0"
      })
      setComputer(computer)
      setBalance(await computer.db.wallet.getBalance())
  
     console.log('async initializing the  default computer')
    }
    if(computer === null){
      setUpComputer()
       
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
    <h1 className="center">Send Satoshis</h1>
  <h4 className="center">Balance: {balance} satoshis</h4>
    
    <Grid container>
      <Grid xs={2} className="center"></Grid>
      <Grid xs={8} className="center">
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
      <Grid xs={2} className="center"></Grid>
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
  </div>
  )
}

