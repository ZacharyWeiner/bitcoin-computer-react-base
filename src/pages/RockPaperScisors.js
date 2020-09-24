import React, {useState, useEffect} from "react";
import {Button, Grid, TextField, Card} from '@material-ui/core'
import Computer from 'bitcoin-computer'
import FileUtilities from "../utilities/FileUtils"
import UUID from '../utilities/UUID'
import * as Constants from './../constants/LocalStorageConstants'

function RockPaperScisors(){
    const [computer, setComputer] = useState(null)
    const [seed, setSeed] = useState('')
    const [address, setAddress] = useState('')
    const [balance, setBalance] = useState('')

    
    useEffect(() => {
        const setUpComputer = async (seed, path) =>{
          const _computer = new Computer({
            seed: seed,
            chain: "BSV", // BSV or BCH
            network: "testnet", // testnet or livenet
            path: path // defaults to "m/44'/0'/0'/0"
          })
          setComputer(_computer)
          setAddress(await _computer.db.wallet.getAddress().toString())
          setBalance(await _computer.db.wallet.getBalance())
          console.log('async initializing the  default computer')
        }
        let seed = window.localStorage.getItem(Constants.SEED)
        let path = Constants.BASIC_GAME_PATH
        if(seed && computer === null){
          setUpComputer(seed, path)
        }
    
      }, [computer])
    return (
        <div>
            {!seed && !computer ?(
                <div>
                    <br/>
                    You Must Login To Use This Feature 
                </div>
            ) 
            : (
                <div>
                    <Grid container>
                        <Grid item xs={6}> {address} </Grid>
                        <Grid item xs={2}> {balance} satoshis</Grid>
                        <Grid item xs={12}> </Grid>
                    </Grid>
                </div>
            )}
        </div>
    )
}

export default RockPaperScisors