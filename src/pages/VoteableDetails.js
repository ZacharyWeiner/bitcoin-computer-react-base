import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import {Button, Card, Grid, Typography} from '@material-ui/core'
import Computer from 'bitcoin-computer'
import * as Constants from './../constants/LocalStorageConstants'
import AddressDetails from './../components/AddressDetails.js'
import SendIcon from '@material-ui/icons/Send'


class Vote{
    constructor(pubKey, vote){
      this.pubKey = pubKey
      this.vote = vote
    }
  }
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
function VoteableDetails(){
    const [refresh, setRefresh] = useState(null)
    const [computer, setComputer] = useState(null)
    const [address, setAddress] = useState('')
    const [publicKey, setPublicKey] = useState('')
    const [balance, setBalance] = useState(0)
    const [voteable, setVoteable] = useState(null)
    const [lastRev, setLastRev] = useState(null)
    const { id } = useParams()
    useEffect(() =>{
        const setUpComputer = async (seed, path) =>{
            const nftComputer = new Computer({
                seed: seed,
                chain: "BSV", // BSV or BCH
                network: "testnet", // testnet or livenet
                path: path // defaults to "m/44'/0'/0'/0"
                })
                setComputer(nftComputer)
                let a = await nftComputer.db.wallet.getAddress().toString()
                setAddress(a)
                let b = await nftComputer.db.wallet.getBalance()
                setBalance(b)
                let pk = await nftComputer.db.wallet.getPublicKey().toString()
                setPublicKey(pk)
                console.log('async initializing the  default computer')
          }
          const awaitGetLatestRevs = async () =>{
            const rev = await computer.getLatestRev(id)
            if(rev !== lastRev){
                setLastRev(rev)
                setVoteable(await computer.sync(rev))
            }
        }
          let seed = window.localStorage.getItem(Constants.SEED)
          let path = Constants.BASIC_VOTEABLE_PATH
          if(!!seed & computer === null){
            console.log(seed)
            setUpComputer(seed, path)
          }
          if(computer !== null ){
            console.log("getting revs")
            awaitGetLatestRevs()
            console.log("done getting revs")
        }
    }, [computer, id, lastRev])
    useEffect(() => {
        
        
    })  

    function upVote(){     
        voteable.vote(publicKey, "up")
    }
    function downVote(){
        voteable.vote(publicKey, "down")
    }
    function RenderVotes(){
        let votes_ui = null
        if(voteable && voteable.votes && voteable.votes.length > 0){
            votes_ui =  voteable.votes.map((v) =>{ return <Card key={v}><Typography className={classes.paper} variant='h6' control='h6' >{v}</Typography></Card> })
        }
        return votes_ui
    }

    function RenderVoteButtons(){
        if(voteable && voteable.votes){
            let show_vote = true 
            voteable.votes.map((v) => {
                if(v.includes(publicKey)){
                    show_vote = false
                }
            })
            if(show_vote){
                return(
                    <div>
                        <Button color='primary' variant='contained' onClick={upVote} name="UpVote"> UpVote </Button> 
                        <Button color='secondary' variant='contained' onClick={downVote} name="DownVote"> DownVote </Button>
                    </div>
                )
            }else{
                return(<Typography className={classes.paper} variant='h6' control='h6' styles={{margin:'12px'}}>You Have Already Voted</Typography>)
            }
        } else {return (<Typography className={classes.paper} variant='h6' control='h6' styles={{margin:'12px'}}>No Votes Yet</Typography>)}
    }

   
    const classes = useStyles()
    return(
    <div> 
        <AddressDetails computer={computer} balance={balance} address={address} publicKey={publicKey} />
        <Card styles={{padding:'12px'}}> 
            <Grid container align='center'> 
                <Grid item xs={12} style={{paddingTop:'48px'}}>
                    <Typography control='h1' variant='h1' >{voteable ? (voteable.name ) : ""}</Typography>
                    <div>Votable Details with id: {id}</div>
                </Grid>
                <Grid item xs={12} style={{paddingTop:'48px'}}>
                <Typography control='h6' variant='h6' >Description: <br/> {voteable ? (voteable.description ) : ""}</Typography>
                
                </Grid>
            </Grid>
        </Card>
        <RenderVoteButtons styles={{margin:'12px'}}/>
        <RenderVotes styles={{margin:'12px'}}/>
    </div>
    )

}

export default VoteableDetails