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








//1. - Global - Create a Seed and get an address to hold the list of logged in players 
//2. - Add a constant for that seed & address 
//3 - User arrives and 
//3.1 - There are no games in queue 
    //User clicks 'I want to play' - they fund the address, initialize the global computer, and add themselves to the array of players 
//3.2 - There are games in queue 
//4. - User clicks I want to play with X 
//5. The user selects their play. 
//6. A Game contract is created. Initializing user is set as player 1, and sets their encrypted move. The public key from queue is assigned as player2. 
    // and change the owner to player 2. 
//7. player 2 saves their move. 
//8. Game checks potential move hashes against hashed move. 
    //If hashed move is == to hash of potential move, assign move. 
    //If Not player 2 wins. 
//9. Apply game rules to moves to calculate a winner. Set winner and loser 
//11. Assign both users as owners 
//10. Place state in such a way that no data can be changed. game_complete = true





//More Simple - Player 2 is known 
// 1. Player 1 Clicks create game 
// 2. Player 1 is prompted to save a move storage key (salt). 
// 3. storagekey is saved to an object that Player 1 Owns at a different path 
// 4. Player 1 makes a salted move with path and address for salt and adds to player 2 as an owner 
// 5. Player 2 syncs and makes move 
// 6. Player sees a button that says "Ready To Play" - clicking pulls the salt, compares to all permutations on client machine and sends move, match and salt. 
// 7. Contract compares moves to determine outcome, assigns winner & loser field and sets game_complete = true which should preclude any changes from being made from here forward/  