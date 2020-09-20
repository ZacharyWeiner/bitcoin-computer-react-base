import React, {useState, useEffect} from "react";
import {Button, Grid, TextField, Card} from '@material-ui/core'
import Computer from 'bitcoin-computer'
import FileUtilities from "../utilities/FileUtils"
import UUID from '../utilities/UUID'

function RockPaperScisors(){
    const [computer, setComputer] = useState(null)
    const [seed, setSeed] = useState('')
    const [address, setAddress] = useState('')
    const [balance, setBalance] = useState('')

    const handleBlur = async (e) => {
        if(e.target.name === "seed" ){
            setSeed(e.target.value)
            let _seed = e.target.value
            let _computer = new Computer({
                                seed: _seed,
                                chain: "BSV", // BSV or BCH
                                network: "testnet", // testnet or livenet
                                path: "m/44'/4'/0'/0" // defaults to "m/44'/0'/0'/0"
                                })
            setComputer(_computer)
            setAddress(_computer.db.wallet.getAddress().toString())
            setBalance(await _computer.db.wallet.getBalance())
            console.log(await UUID.createUUID())
        } 
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
                            <TextField name="seed" fullWidth defaultValue={seed} onBlur={handleBlur} helperText="Seed Phrase" ></TextField>
                            <Button color="primary" variant="contained"> Save Seed </Button>
                        </Card>
                        </Grid>
                    </Grid>
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