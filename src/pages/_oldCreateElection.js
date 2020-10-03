import React, {useState, useEffect} from 'react'
import { useHistory } from "react-router-dom";
import {Avatar, Button, Checkbox, Container, CssBaseline, Grid, TextField, Card, Typography} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Computer from 'bitcoin-computer'
import FileUtilities from "../utilities/FileUtils"
import * as Constants from '../constants/LocalStorageConstants'
import AddressDetails from '../components/AddressDetails.js'
import TokenWallet from '../components/TokenWallet.js'
import SendIcon from '@material-ui/icons/Send'
import BSVUtils from '../utilities/BSVUtils.js'
import useInterval from '../utilities/UseInterval.js'
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

export default function CreateElection(){
    const [computer, setComputer] = useState(null)
    const [address, setAddress] = useState('Loading...')
    const [publicKey, setPublicKey] = useState('Loading...')
    const [balance, setBalance] = useState(0)
    const [loading, setLoading] = useState(false) 
    const [tokens, setTokens] = useState([])
    const [revs, setRevs] = useState([])
    const [title, setTitle] = useState('')
    const [numVoters, setNumVoters] = useState(0)
    const [can1name, setCan1Name] = useState('')
    const [can2name, setCan2Name] = useState('')
    const [can3name, setCan3Name] = useState('')
    const [can1PK, setCan1PK] = useState('')
    const [can2PK, setCan2PK] = useState('')
    const [can3PK, setCan3PK] = useState('')
    const [electionSeed, setElectionSeed] = useState('')
    const [objects, setObjects] = useState(null)
    const [checked, setChecked] = React.useState(true);
    const history = useHistory()

    const handleChange = (event) => {
      setChecked(event.target.checked);
    };
      

    useEffect(() => {
    const setUpComputer = async (seed, path) => {
        
        console.log("async initializing the  default computer");
        const _computer = new Computer({
        seed: seed,
        chain: "BSV", // BSV or BCH
        network: "testnet", // testnet or livenet
        path: path, // defaults to "m/44'/0'/0'/0"
        });
        setComputer(_computer);
        setAddress(await _computer.db.wallet.getAddress().toString());
        setBalance(await _computer.db.wallet.getBalance());
        setPublicKey(await _computer.db.wallet.getPublicKey().toString());
        setLoading(false)
    };
    const fetchRevs = async () => {
        setRevs(await computer.getRevs(computer.db.wallet.getPublicKey()));
    };
    let seed = window.localStorage.getItem(Constants.SEED);
    let path = Constants.ELECTION_PATH;
    if (!!seed & (computer === null)) {
        setLoading(true)
        setUpComputer(seed, path);
    }
    if (computer !== null) {
        fetchRevs();
    }
    }, [computer]);

    const createVote = async (e) => {
        e.preventDefault()
        console.log("creating vote ")
        const Vote = await FileUtilities.importFromPublic('/contracts/Vote.js')
        let details = await BSVUtils.generateElectionDetails()
        setElectionSeed(details['seed'])
        setCan1PK(details.publicKeys[0])
        setCan2PK(details.publicKeys[1])
        setCan3PK(details.publicKeys[2])
        console.log('Election seed: ' + details['seed'] +  "OwnerPK: " + details.owner)
        console.log(details)
        let election;
        // By Default the votes will all be owned by the same seed used to create the addresses for the candiates
        // If you would like to auto assign the votes to yourself, uncheck the checkbox 
        if(checked){
          election = await computer.new(Vote, [details.owner, details.owner, title, parseInt(500000), can1name, details.publicKeys[0], can2name, details.publicKeys[1], can3name, details.publicKeys[2]])
        }
        else{
          election = await computer.new(Vote, [publicKey, publicKey, title, parseInt(500000), can1name, details.publicKeys[0], can2name, details.publicKeys[1], can3name, details.publicKeys[2]])
        }
        
        console.log(election)
        let message = `An Election: ${title}, has been created. \n\n The Seed For Managing Ballot Distribution is: ${details['seed']} \n  COPY THIS SEED TO SOMEWHERE SAFE.  \n ${can1name}'s election key is: ${details.publicKeys[0]} is at path m44001 \n ${can2name}'s election key is ${details.publicKeys[1]} is at path 44002 \n ${can3name}'s electon key is ${details.publicKeys[2]} is at path m44003`
        alert(message)
    }
    useInterval(() => {
    const refresh = async () => {
        if (computer) {
          let a = await computer.db.wallet.getAddress().toString()
          setAddress(a)
          let b = await computer.db.wallet.getBalance()
          setBalance(b)
          console.log('async initializing the  default computer')
          setPublicKey(await computer.db.wallet.getPublicKey().toString())

          const revs = await computer.getRevs(computer.db.wallet.getPublicKey().toString())
          console.log(revs)
          let objs = await Promise.all(revs.map(async rev =>  computer.sync(rev)))
          console.log(objs)
          setObjects(objs)
        }
      }
      refresh()
    }, 3000)
  
    
  
    const groupByRoot = (list) => list.reduce(
      (acc, obj) => ({
        ...acc,
        [obj['_rootId']]: (acc[obj['_rootId']] || []).concat(obj)
      }),
      {}
    )
    const classes = useStyles()
    return (
        <div> 
            <CssBaseline />
            <AddressDetails computer={computer} balance={balance} address={address} publicKey={publicKey} />
            <Container control='main' maxWidth="md">
            {loading 
            ? (<Typography component="h1" variant="h3">
                    Loading
                </Typography>) 
            : (
                <Card>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                    <SendIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                    Create A New Issue To Vote On
                    </Typography>
                    <form className={classes.form} noValidate  onSubmit={createVote}> 
                    <Typography component="p" variant="body1">
                    <Checkbox
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                       Use the seed created for the candidates to distribute the votes. <br/> (unchecking this will assign you as the distributor) 
                    </Typography>
                    
                        <TextField 
                            defaultValue={title} 
                            onBlur={(e) => {setTitle(e.target.value)}}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="title"
                            label="Vote Title (i.e. Congressional District 213 - 2020)"
                            name="title"/>
                        <TextField 
                            defaultValue={numVoters} 
                            onBlur={(e) => {setNumVoters(e.target.value)}}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            type="number"
                            id="numVoters"
                            label="Total Number of Voters"
                            name="numVoters"/>
                        <TextField 
                            defaultValue={can1name} 
                            onBlur={(e) => {setCan1Name(e.target.value)}}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="can1name"
                            label="Name of Candidate 1"
                            name="can1name"/>
                            {can1name}
                        {/* <TextField 
                            defaultValue={can1PK} 
                            onBlur={(e) => {setCan1PK(e.target.value)}}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="can1PK"
                            label="Public Key To Vote For Candidate 1"
                            name="can1PK"/> */}
                            {can1PK}
                        <TextField 
                            defaultValue={can2name} 
                            onBlur={(e) => {setCan2Name(e.target.value)}}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="can2name"
                            label="Name of Candidate 2"
                            name="can2name"/>
                        {/* <TextField 
                            defaultValue={can2PK} 
                            onBlur={(e) => {setCan2PK(e.target.value)}}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="can2PK"
                            label="Public Key To Vote For Candidate 2"
                            name="can2PK"/> */}
                            {can2PK}
                        <TextField 
                            defaultValue={can3name} 
                            onBlur={(e) => {setCan3Name(e.target.value)}}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="can3name"
                            label="Name of Candidate 3"
                            name="can3name"/>
                        {/* <TextField 
                            defaultValue={can3PK} 
                            onBlur={(e) => {setCan3PK(e.target.value)}}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="can3PK"
                            label="Public Key To Vote For Candidate 3"
                            name="can3PK"/> */}
                            {can3PK}
                        <Button type="submit" >Create </Button>
                    </form>
                </div>
                </Card>
            )}
            </Container>
            {electionSeed}
            <Grid container>
                {objects && Object.values(groupByRoot(objects)).map((o) => 
                    <TokenWallet key={o[0]._id} tokens={o} computer={computer} />
                )}
            </Grid>
        </div> )
}
