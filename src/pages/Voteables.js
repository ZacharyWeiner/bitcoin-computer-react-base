import React, {useState, useEffect} from "react";
import VotableForm from './../components/VotableForm'
import {Button, Card, Grid, TextField} from '@material-ui/core'
import Computer from 'bitcoin-computer'
import FileUtilities from "../utilities/FileUtils"

export default function Votables() {
    const [computer, setComputer] = useState(null)
    const [seed, setSeed] = useState(null)
    const [address, setAddress] = useState(null)
    const [balance, setBalance] = useState(null)
    const [revs, setRevs] = useState([])
    const [refresh, setRefresh] = useState(0)
    const [publicKey, setPublicKey] = useState('')
    const [voter_keys, setVoterKeys] = useState('03a525efd731982ba78b14bb05c6d63cd01697100c6b1c3dbbf67cd19645d1654a,0213a0d5aa6c0d6f2d90e34ad997c121bc991aad3e5056d73bb65b86d8a992ec3f,034a2cb74d8f74ed8e87a585db1ae5c60ad2be1ff1eda7641a56324513b0a70025,03f23fb50f626bf2bb14d77bb6ff08081a32501636973131f956876ddbf14f916e')
    const [description, setDescription] = useState('This is something to vote on, then we will vote and show the state')
    useEffect(() => {
        const fetchRevs = async () => {
          if(computer){
            setRevs(await computer.getRevs(computer.db.wallet.getPublicKey()))
            setTimeout(() => setRefresh(refresh + 1), 3500)
          }
        }
        if(computer !== null){
          fetchRevs() 
        }

      }, [computer, refresh])
    
    const handleBlur = async (e) => {
        if(e.target.value !== ""){
            setSeed(e.target.value)
            const _computer = new Computer({
                seed: e.target.value,
                chain: "BSV", // BSV or BCH
                network: "testnet", // testnet or livenet
                path: "m/44'/0'/0'/9" // defaults to "m/44'/0'/0'/0"
            })
            setComputer(_computer)
            const {db } = _computer 
            const { wallet } = db
            const address = wallet.getAddress()
            const addressString = address.toString()
            console.log(addressString)
            setAddress(_computer.db.wallet.getAddress().toString())
            setBalance( await _computer.db.wallet.getBalance())
            setPublicKey(_computer.db.wallet.getPublicKey().toString())
        }
    }
    const buttonClick = async (e) => {
        e.preventDefault()
        //Create A BasicVotable 
        let owners = voter_keys.split(',')
        const BasicVoteable = await FileUtilities.importFromPublic('/contracts/BasicVoteable.js')
        const token = await computer.new(BasicVoteable, [owners, description])
        console.log('Created votable with id: ' + token._id)
    }
  return (
      <div>
      {!seed && !computer ?(
          <div>
              <br/>
              <Grid container>
                <Grid item xs={2}>{address}</Grid>
                <Grid item xs={8}>
                <Card>
                    <TextField fullWidth defaultValue={seed} onBlur={handleBlur} helperText="Seed Phrase" ></TextField>
                    <Button color="primary" variant="contained"> Save Seed </Button>
                </Card>
                </Grid>
              </Grid>
          </div>
      )
      :
      ( 
        <Grid container>
             <Grid item xs={10}> {publicKey} <br/> {address}</Grid>
             <Grid item xs={2}> {balance} satoshis</Grid>
             <Grid item xs={3}>
                Side Bar 
             </Grid>
             <Grid item xs={9}>
                Main Screen
                {revs.forEach((r) => { "aaaaa"})}
                <Button onClick={buttonClick}> Create Votable </Button>
             </Grid>
        </Grid>
        
      )}
  
  </div>
  )
}

