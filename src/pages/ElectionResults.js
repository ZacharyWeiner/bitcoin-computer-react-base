import React, {useState, useEffect} from "react";
import {useParams} from 'react-router-dom'
import Computer from 'bitcoin-computer'
import * as Constants from './../constants/LocalStorageConstants.js'
import {Button, Card, Grid, Typography} from '@material-ui/core'
import MintElection from './../components/MintElection.js'
import useInterval from './../utilities/UseInterval'
import VoteWallet from './../components/VoteWallet.js'
import AddressDetails from './../components/AddressDetails.js'


function Elections({_objects})
{
    const [loading, setLoading] = useState(true)
    const [computer, setComputer] = useState(null)
    const [can1objects, setCan1Objects] = useState(null)
    const [can2objects, setCan2Objects] = useState(null)
    const [can3objects, setCan3Objects] = useState(null)
    const [electionName, setElectionName] = useState('')
    const [can1name, setCan1Name] = useState('')
    const [can2name, setCan2Name] = useState('')
    const [can3name, setCan3Name] = useState('')
    const [chain, setChain] = useState('BSV')
    const [address, setAddress] = useState('Loading...')
    const [balance, setBalance] = useState(0)
    const [publicKey, setPublicKey] = useState('Loading...')
    const { id } = useParams()
  
    useInterval(() => {
      // BIP_39_KEY & CHAIN is set on login and we fetch it from local storage
      const password = window.localStorage.getItem(Constants.SEED)
      setChain("BSV")
  
      const isLoggedIn = password && chain
      // if you are currently logging in
      if (isLoggedIn && !computer){
        setComputer(new Computer({ chain: "BSV", network: 'testnet', seed: password, path: Constants.ELECTION_PATH }))
        console.log("Bitcoin Computer created on " + chain)
      // if you are currently logging out
      } else if (!isLoggedIn && computer){
        console.log("You have been logged out")
        setComputer(null)
      }

      const refresh = async () => {
        if (computer && id) {
          let a = await computer.db.wallet.getAddress().toString()
          setAddress(a)
          let b = await computer.db.wallet.getBalance()
          setBalance(b)
          console.log('async initializing the  default computer')
          const rev = await computer.getLatestRev(id)
          console.log("latest rev:" + rev)
          let election = await computer.sync(rev)
          const _electionName = election.name
          console.log('Election: ' +  _electionName)
          setElectionName(_electionName)

          if(election){
            //Candidate 1 
            const _can1revs = await computer.getRevs(election.cand1PK)
            console.log(_can1revs)
            let _can1objs = await Promise.all(_can1revs.map(async rev =>  computer.sync(rev)))
            console.log(_can1objs)
            setCan1Objects(_can1objs)
            setCan1Name(election.can1name)


            //Candidate 2
            const _can2revs = await computer.getRevs(election.cand2PK)
            console.log(_can2revs)
            let _can2objs = await Promise.all(_can2revs.map(async rev =>  computer.sync(rev)))
            console.log(_can2objs)
            setCan2Objects(_can2objs)
            setCan2Name(election.can2name)

            //Candidate 3
            const _can3revs = await computer.getRevs(election.cand3PK)
            console.log(_can3revs)
            let _can3objs = await Promise.all(_can3revs.map(async rev =>  computer.sync(rev)))
            console.log(_can3objs)
            setCan3Objects(_can3objs)
            setCan3Name(election.can3name)
          }
        }
        setLoading(false)
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
  
    return (
        <div>
        <Card>
        {loading && (<div> Loading ...</div>)}
        <Typography control='h1' variant='h1' align='center'>{electionName}</Typography>
          <Grid container> 
            <Grid item xs={12} md={4} align='center'>
                <Typography control='h4' variant='h4'>{can1name}</Typography>
                {can1objects && Object.values(groupByRoot(can1objects)).map((o) => 
                <div key={o[0]._id}> {o[0].name} = {o.length} </div>
                )}
            </Grid>
            <Grid item xs={12} md={4} align='center'>
            <Typography control='h4' variant='h4'>{can2name}</Typography>
            {can2objects && Object.values(groupByRoot(can2objects)).map((o) => 
                <div key={o[0]._id}> {o[0].name} = {o.length} </div>
                )}
            </Grid>
            <Grid item xs={12} md={4} align='center'>
            <Typography control='h4' variant='h4'>{can3name}</Typography>
            {can3objects && Object.values(groupByRoot(can3objects)).map((o) => 
                <div key={o[0]._id}> {o[0].name} = {o.length} </div>
                )}
            </Grid>
          </Grid>
          </Card>
        </div>
    )
  }
  
  export default Elections