import React, {useState} from "react";
import {
  useHistory
} from "react-router-dom";
import Computer from 'bitcoin-computer'
import { Button, Grid, Card, TextField} from '@material-ui/core'
import * as Constants from './../constants/LocalStorageConstants'

function Login({computer, setComputer}) {
  const [seed, setSeed] = useState('')
  const [username, setUsername] = useState('')
  let history = useHistory()

  const handleChange = (e) => {
      if(e.target.name === 'username_box'){
        setUsername(e.target.value)
        window.localStorage.setItem(Constants.USERNAME, e.target.value)
      } else {
        let _seed = e.target.value 
        window.localStorage.setItem(Constants.SEED, e.target.value)
        setSeed(_seed)
      }
  }
  const handleClick = (e) => {
      e.preventDefault()
      computer = new Computer({
        seed: seed,
        chain: "BSV", 
        network: "testnet"
      })
      if(computer !== null){
        history.push('home')
      }
  }
  
  return (
    <div>
        <br/>
        <h2>Login</h2>
        <Grid container>
        <Grid item xs={8}>
        <Card>
            <TextField fullWidth name='username_box' value={username} onChange={handleChange} helperText="Username" ></TextField>
            <TextField fullWidth defaultValue={seed} onChange={handleChange} helperText="Seed Phrase" ></TextField>
            <Button onClick={handleClick} color="primary" variant="contained"> Login </Button>
        </Card>
        </Grid>
        </Grid>
    </div>
    )
}

export default Login
