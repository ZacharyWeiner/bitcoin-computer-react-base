import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import {Button} from '@material-ui/core'
import Computer from 'bitcoin-computer'
import LocalStorageConstants from './../constants/LocalStorageConstants'


class Vote{
    constructor(pubKey, vote){
      this.pubKey = pubKey
      this.vote = vote
    }
  }

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
          let seed = window.localStorage.getItem(LocalStorageConstants.seed)
          let path = LocalStorageConstants.basic_votable_path
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
            votes_ui =  voteable.votes.map((v) =>{ return <div key={v}>{v}</div> })
        }
        return votes_ui
    }

    function RenderVoteButtons(){
        if(voteable && voteable.votes && voteable.votes.length > 0){

        }
    }
    return(
    <div> 
        <h4> Address: {address} </h4>
        <h4> Balance: {balance} </h4>
        <div>Votable Details with id: {id}</div>
        <div>Votable Name: {voteable ? (voteable.name ) : ""}</div>
        <div>Description: {voteable ? (voteable.description ) : ""}</div>
        <Button onClick={upVote} name="UpVote"> UpVote </Button> 
        <Button onClick={downVote} name="DownVote"> DownVote </Button>
        <RenderVotes />
    </div>
    )

}

export default VoteableDetails