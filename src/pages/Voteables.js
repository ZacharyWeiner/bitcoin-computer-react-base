import React, {useState, useEffect} from "react";
import {Button, Grid, TextField, Card} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Computer from 'bitcoin-computer'
import FileUtilities from "../utilities/FileUtils"
import NonFungibleTokenCard from './../components/NonFungibleTokenCard.js'
import LocalStorageConstants from './../constants/LocalStorageConstants'
import { useHistory } from "react-router-dom";

export default function Voteables() {
    const [computer, setComputer] = useState(null)
    const [address, setAddress] = useState('')
    const [balance, setBalance] = useState('')
    const [url, setUrl] = useState('')
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false) 
    const [tokens, setTokens] = useState([])
    const [revs, setRevs] = useState([])
    const [refresh, setRefresh] = useState(0)
    const history = useHistory()

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
                path: path// defaults to "m/44'/0'/0'/0"
                })
                setComputer(nftComputer)
                let a = await nftComputer.db.wallet.getAddress().toString()
                setAddress(a)
                let b = await nftComputer.db.wallet.getBalance()
                setBalance(b)
                console.log('async initializing the  default computer')
          }
          const fetchRevs = async () => {
            setRevs(await computer.getRevs(computer.db.wallet.getPublicKey()))
            setTimeout(() => setRefresh(refresh + 1), 3500)
          }
          let seed = window.localStorage.getItem(LocalStorageConstants.seed)
          let path = LocalStorageConstants.basic_votable_path
          if(!!seed & computer === null){
            console.log(seed)
            setUpComputer(seed, path)
             
          }
          if(computer !== null){
            fetchRevs() 
          }

        }, [computer, refresh])

    const createVotable = async (e) => {
      try{
          e.preventDefault()
          setLoading(true)
          console.log('Votable Computer')
          console.log("Votable Computer Public Address:" + computer.db.wallet.getAddress().toString())
          const publicKey = computer.db.wallet.getPublicKey().toString()
          console.log("Getting Balance of Smart Contract Deploy From Address Before Creating Token")
          console.log(await computer.db.wallet.getBalance())
          console.log("Creating A Smart Contract with PublicKey: " + publicKey)
          const BasicVoteable = await FileUtilities.importFromPublic('/contracts/BasicVoteable.js')
          const token = await computer.new(BasicVoteable, [publicKey, "Proposal Name", "A Cool Description of an awesome proposal", {}])
          console.log('Created token with id', token._id)
          console.log("Getting Balance of Smart Contract Deploy From Address After Creating Token")
          console.log(await computer.db.wallet.getBalance())
          history.push('/voteable/' + token._id)

      } catch (err) {
        if(err.message.startsWith('Insufficient balance in address'))
          alert('You have to fund your wallet https://faucet.bitcoincloud.net/')
        else{
          console.log(err)
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
       <h4 className="center">Address: {address} </h4>
       <h4 className="center">Balance: {balance} satoshis</h4>
        <Card variant="outlined">
        <Grid item xs={12}><h1>Voteables</h1></Grid>
        <form onSubmit={createVotable}>
            <Grid container> 
                <Grid item xs={2}></Grid>
                <Grid item xs={8}>
                    Title <br/>
                    <TextField name="title" placeholder="Title The Token" defaultValue={title}  onBlur={handleBlur} className={classes.root} fullWidth/>    
                    <br/>
                    Description <br/>
                    <TextField name="description" placeholder="Describe the Token in as much detail as you need" defaultValue={title}  onBlur={handleBlur} className={classes.root} fullWidth/>                      
                    <br/>
                    Url<br/>
                    <TextField name="url" defaultValue={title} placeholder="This can be an image, video, file, or web url"  onBlur={handleBlur} className={classes.root} fullWidth/>    
                    <br /><br />
                    <Button type="submit" variant='contained' color='primary'> Create The Token </Button>
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={12}></Grid>
            </Grid>
        </form>
        </Card>
        <Card variant="outlined">
            {loading && (<p>Loading...</p>)}
        <Grid item xs={12}>
            <Grid container>
            {tokens !== null && tokens.map(token => {
              if(token !== null){
                return (
                    <div key={token._id.toString()}>
                        {token._id.toString()} {token.name} 
                        <br/>{token.description}
                      </div> 
                    )
                }else{
                  return (<div></div>)
                }
            })}
            </Grid>
        </Grid>
        </Card>
      </div>)
}

