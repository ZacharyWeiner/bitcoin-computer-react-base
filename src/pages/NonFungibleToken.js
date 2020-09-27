import React, {useState, useEffect} from "react";
import {Button, Grid, TextField, Card, Container, CssBaseline, Avatar, Typography} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Computer from 'bitcoin-computer'
import FileUtilities from "../utilities/FileUtils"
import NonFungibleTokenCard from './../components/NonFungibleTokenCard.js'
import * as Constants from './../constants/LocalStorageConstants'
import { useHistory } from "react-router-dom";
import AddressDetails from './../components/AddressDetails.js'
import SendIcon from '@material-ui/icons/Send'

export default function NonFungibleToken() {
    const [computer, setComputer] = useState(null)
    const [address, setAddress] = useState('Not Logged In')
    const [balance, setBalance] = useState(0)
    const [url, setUrl] = useState('')
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false) 
    const [tokens, setTokens] = useState([])
    const [revs, setRevs] = useState([])
    const [refresh, setRefresh] = useState(0)
    const [publicKey, setPublicKey] = useState('Not Logged In')
  

    const handleBlur = async (e) => {
        if(e.target.name === 'title'){
            setTitle(e.target.value)
        }else if (e.target.name === "description"){
            setDescription(e.target.value)
        }else if (e.target.name === "url"){
            setUrl(e.target.value)
        }
      }

      useEffect(() => {
          const setUpComputer = async (seed, path) =>{
            const nftComputer = new Computer({
                seed: seed,
                chain: "BSV", // BSV or BCH
                network: "testnet", // testnet or livenet
                path:  path// defaults to "m/44'/0'/0'/0"
                })
               
                setComputer(nftComputer)
                let a = await nftComputer.db.wallet.getAddress().toString()
                setAddress(a)
                let b = await nftComputer.db.wallet.getBalance()
                setBalance(b)
                console.log('async initializing the  default computer')
                setPublicKey(await nftComputer.db.wallet.getPublicKey().toString())
          }
          const fetchRevs = async () => {
            setRevs(await computer.getRevs(computer.db.wallet.getPublicKey()))
            setTimeout(() => setRefresh(refresh + 1), 3500)
          }
          let seed = window.localStorage.getItem(Constants.SEED)
          let path = Constants.NFT_PATH
          if(!!seed & computer === null){
            console.log(seed)
            setUpComputer(seed, path)
             
          }
          if(computer !== null){
            fetchRevs() 
          }

        }, [computer, refresh])

    const sendToken = async (e) => {
      try{
        e.preventDefault()
        setLoading(true)
        if(title === ''){
            alert("The title must not be empty")
            
        }else{

            alert(`${title} -  ${description} - ${url}`)
            console.log('NFT Computer')
            
            console.log("NFT Computer Public Address:" + computer.db.wallet.getAddress().toString())
            console.log("Creating A Smart Contract")
            const publicKey = computer.db.wallet.getPublicKey().toString()
            console.log("Getting Balance of Smart Contract Deploy From Address Before Creating Token")
            console.log(await computer.db.wallet.getBalance())
            const ExampleNFT = await FileUtilities.importFromPublic('/contracts/ExampleNFT.js')
            const token = await computer.new(ExampleNFT, [publicKey, title, description, url])
            console.log('Created token with id', token._id)
            
            
            console.log("Getting Balance of Smart Contract Deploy From Address Before Creating Token")
            console.log(await computer.db.wallet.getBalance())
        }

      } catch (err) {
        if(err.message.startsWith('Insufficient balance in address'))
          alert('You have to fund your wallet https://faucet.bitcoincloud.net/')
        else{
          console.log(err)
          alert(err)
        }
      }
      setLoading(false)
    }


    useEffect(() => {
        const fetchNFTs = async () => {
          
          setTokens(await Promise.all(revs.map(async rev => computer.sync(rev))))
        }
        fetchNFTs()
      }, [revs, computer])


      const useStyles = makeStyles((theme) => ({
        root: {
          minWidth: 275,
        },
        paper: {
          margin: theme.spacing(4),
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
      }));
    const classes = useStyles()

  return (
    <div>
       <AddressDetails computer={computer} balance={balance} address={address} publicKey={publicKey} />
       <br />
        <Container component="main" maxWidth="md">
          <CssBaseline />
          <Card>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <SendIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Create A New Token
            </Typography>
            <form className={classes.form} noValidate  onSubmit={sendToken}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="title"
                label="Token Title"
                name="title"
                defaultValue={""}  onBlur={handleBlur}
              />  
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Description"
                type="text"
                id="description"
                name="description" 
                defaultValue={''}  
                onBlur={handleBlur}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Image URL"
                type="text"
                id="url"
                name="url" 
                defaultValue={''}  
                onBlur={handleBlur}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Create Your Token
              </Button>
            </form>
            
          </div>
          </Card>
          <br />
        </Container>
        <Card variant="outlined">
            {loading && (<p>Loading...</p>)}
        <Grid item xs={12}>
            <Grid container>
            {tokens.map(token => {
                return <NonFungibleTokenCard key={token._id} computer={computer} token={token} />
            })}
            </Grid>
        </Grid>
        </Card>
      </div>)
}

