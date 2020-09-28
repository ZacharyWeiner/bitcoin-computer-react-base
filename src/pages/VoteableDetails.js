import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import {Button, Card, CardContent, Container, Grid, Typography} from '@material-ui/core'
import Computer from 'bitcoin-computer'
import * as Constants from './../constants/LocalStorageConstants'
import AddressDetails from './../components/AddressDetails.js'
import SendIcon from '@material-ui/icons/Send'
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import VisibilityIcon from '@material-ui/icons/Visibility';

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
    const [loading, setLoading] = useState(false)
    const [disableButtons, setDisableButtons] = useState(false)
    const { id } = useParams()
    
    const handleClick = async (e) =>{
        setLoading(true)
        let prompt_response =  prompt("Enter The New Voters Public Key");
        if (prompt_response.length > 0 ){
            console.log(await voteable.addVoter(prompt_response))
        }
        setLoading(false)
    }
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }
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
            setTimeout(() => setRefresh(refresh + 1), 3500)
            setLoading(false)
            console.log("done getting revs")
        }
        
    }, [computer, id, lastRev, refresh])

    function upVote(e){
        try{
            e.preventDefault()
            setDisableButtons(true)
            setLoading(true)     
            voteable.vote(publicKey, "up")
            // window.location.reload();
        }catch(err){
            alert(err)
        }
        
    }
    function downVote(e){
        try{
            e.preventDefault()
            setDisableButtons(true)
            setLoading(true)     
            voteable.vote(publicKey, "down")
            sleep(5000)
            setLoading(false)
            // window.location.reload();
        }catch(err){
            alert(err)
        
        }
    }
    function RenderVotes(){
        let votes_ui = null
        if(voteable && voteable.votes && voteable.votes.length > 0){
            votes_ui =  voteable.votes.map((v) =>{ return <Card key={v}><Typography className={classes.paper} variant='body2' control='p' >{v}</Typography></Card> })
        }
        return votes_ui
    }

    function RenderVoteButtons(){
        if(voteable && voteable.votes){
            let show_vote = true 
            if(disableButtons){
                show_vote = false
            }else {
                voteable.votes.map((v) => {
                    if(v.includes(publicKey)){
                        show_vote = false
                    }
                })
            }
            if(show_vote){
                return(
                    <Container component="main" maxWidth="md">
                    <Card align='center'>
                        <CardContent>
                        {/* <Button color='primary' variant='contained' onClick={upVote} name="UpVote"> UpVote </Button>  */}
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<ThumbUpIcon />}
                            onClick={upVote}
                            name="UpVote"
                        >
                            UpVote
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            startIcon={<ThumbDownIcon />}
                            onClick={downVote}
                            name="DownVote"
                        >
                            DownVote
                        </Button>
                        {/* <Button color='secondary' variant='contained' onClick={downVote} name="DownVote"> DownVote </Button> */}
                        </CardContent> 
                    </Card>
                    </Container>
                )
            }else{
                return(<Typography className={classes.paper} variant='h6' control='h6' styles={{margin:'12px'}}>You Have Already Voted</Typography>)
            }
        } else {return (<Typography className={classes.paper} variant='h6' control='h6' styles={{margin:'12px'}}>No Votes Yet</Typography>)}
    }

    function linkID(){
        return id.split(':')[0]
    }
    function chainLink(){
       return  `https://test.whatsonchain.com/tx/${linkID()}`
    }

    function RenderVoters(){
        if(voteable){
            let _voters = []
            voteable.voters.map((v) => {
                return (_voters.push(<div key={v}>{v}</div>))
            })
            return _voters
        }else{
            return (<div>Loading...</div>)
        }
    }
   
    const classes = useStyles()
    return(
    <div> 
        <AddressDetails computer={computer} balance={balance} address={address} publicKey={publicKey} />
        <Grid container> 
        <Grid item xs={12} md={6} style={{backgroundColor:"#000", color:'#fff'}}>
            <h1 align="center" className="script big-head">The Contract</h1>
            <h3 align="" ><span className="script" style={{padding:'8px'}}>1.</span> Record Your Vote</h3>
            <p>Now that you have a voteable / proposal you can send your thumbs up or thumbs down vote to be stored on the blockchain for eternity.
            </p>
            <h3 align="" ><span className="script" style={{padding:'8px'}}>2.</span> Add Voters</h3>
            <p>In the most basic version of a voting application the creator of the vote or proposal can add any number of voters to the contract.
            </p>
            <p>Once a voter has been added to the contract they can also add new voters to the contract. 
            </p>
            <small>This is just for demonstration purposes and should not be used in production. Remeber you can create your own public / private keys so in production if anyone were allwed to vote, someone could add their own vote multiple tiem from different public keys. </small>

        </Grid>
        <Grid item xs={12} md={6}>
            <br />
            <Card styles={{padding:'12px'}}> 
                <Grid container align='center'> 
                    <Grid item xs={12} style={{paddingTop:'48px'}}>
                        <Typography control='h1' variant='h1' >{voteable ? (voteable.name ) : ""}</Typography>
                        <div>Votable Details At txID: {id}</div>
                    </Grid>
                    <Grid item xs={12} style={{paddingTop:'48px'}}>
                        <Typography control='h6' variant='h6' >Description: <br/> {voteable ? (voteable.description ) : ""}</Typography><br/>
                        <Button variant='contained' color='secondary' size='large' onClick={handleClick}  startIcon={<PersonAddIcon />}>Add A Voter</Button><span style={{padding:"24px"}}></span>
                        <Button variant='contained' color='primary' size='large' href={chainLink()}  startIcon={<VisibilityIcon />}>View on Chain</Button>
                    </Grid>
                </Grid>
            </Card>
            <RenderVoteButtons styles={{margin:'12px'}}/>
            {/* <RenderVoters /> */}
            <RenderVotes styles={{margin:'12px'}}/>
            {loading && (<Typography control='h4' variant='h4'> Loading... </Typography>)}
        </Grid>
        </Grid>
        <br/>
        
    </div>
    )

}

export default VoteableDetails