import React, {useState, useEffect} from 'react'
import { useHistory } from "react-router-dom";
import {Avatar, Button, Container, CssBaseline, Grid, TextField, Card, Typography} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Computer from 'bitcoin-computer'
import FileUtilities from "../utilities/FileUtils"
import * as Constants from '../constants/LocalStorageConstants'
import AddressDetails from '../components/AddressDetails.js'
import VoteWallet from '../components/VoteWallet.js'
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

export default function Elections(){
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
    const history = useHistory()

    useEffect(() => {
    const setUpComputer = async (seed, path) => {
        
        console.log("async initializing the  default computer");
        const _computer = new Computer({
        seed: seed,
        chain: "BSV", // BSV or BCH
        network: "testnet", // testnet or livenet
        path: "m/44'/0'/0'/0"
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
    }, 5000)
  
    
  
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
                <Grid container>
                    {objects && Object.values(groupByRoot(objects)).map((o) => 
                        <VoteWallet key={o[0]._id} votes={o} computer={computer} publicKey={publicKey} rev={o[0]._rev} />
                    )}
                </Grid>
            )}
            </Container>
            
        </div> )
}
