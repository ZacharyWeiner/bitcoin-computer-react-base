import React, {useState, useEffect} from "react";
import {Button, Grid, TextField, Card} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Computer from 'bitcoin-computer'
import FileUtilities from "../utilities/FileUtils"
import NonFungibleTokenCard from './../components/NonFungibleTokenCard.js'

export default function NonFungibleToken() {
    const [computer, setComputer] = useState(null)
    const [url, setUrl] = useState('')
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false) 
    const [tokens, setTokens] = useState([])
    const [revs, setRevs] = useState([])
    const [refresh, setRefresh] = useState(0)

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
          const setUpComputer = async () =>{
            const nftComputer = new Computer({
                seed: "gap math bomb win rule kind exchange black quick buffalo open ripple",
                chain: "BSV", // BSV or BCH
                network: "testnet", // testnet or livenet
                path: "m/44'/1'/0'/0" // defaults to "m/44'/0'/0'/0"
                })
                setComputer(nftComputer)
          }
          const fetchRevs = async () => {
            setRevs(await computer.getRevs(computer.db.wallet.getPublicKey()))
            setTimeout(() => setRefresh(refresh + 1), 3500)
          }
          if(computer === null){
            setUpComputer()
             
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
        <Card variant="outlined">
        <Grid item xs={12}><h1>Non Fungible Token Example</h1></Grid>
        <form onSubmit={sendToken}>
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
            {tokens.map(token => {
                return <NonFungibleTokenCard key={token._id} computer={computer} token={token} />
            })}
            </Grid>
        </Grid>
        </Card>
      </div>)
}
