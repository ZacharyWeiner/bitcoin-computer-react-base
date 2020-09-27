import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Computer from 'bitcoin-computer'
import {Avatar, Button, Card, Container, CssBaseline, TextField, Typography, Grid} from '@material-ui/core'
import FileUtils from './../utilities/FileUtils.js'
import SendIcon from '@material-ui/icons/Send'

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
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
    }
  }));
  

function Mint({computer}){
    const [supply, setSupply] = useState(0)
    const [name, setName] = useState('')
    const [creating, setCreating] = useState(false)
 
    const handleSubmit = async (e) => {
        setCreating(true)
        try{
            e.preventDefault()
            const pubKey = computer.db.wallet.getPublicKey().toString()
            const TOKEN = await FileUtils.importFromPublic('/contracts/Token.js')
            const newToken = await computer.new(TOKEN, [pubKey, supply, name])
            console.log(newToken)
            console.log("Successfully created " + newToken.coins + "of " + newToken.name + "Fungible Coins"  )
        }catch (err){
            if(err.message.startsWith('Insufficient balance in address')){
                alert(`You need testnet coins to mint a token. To get free testnet coins open the your wallet.`)
            } else {
                alert(err)
            }
        }
        setCreating(false)
    }   
    const classes = useStyles()
    return(<div> 
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <SendIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Create New Coins 
            </Typography>
            <form className={classes.form} noValidate  onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="number"
                id="supply"
                label="How Many Coins Do You Want To Create in This Asset Class?"
                name="supply"
                defaultValue={supply}  onChange={(e) => setSupply(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Name of Your Coins"
                type="text"
                id="name"
                name="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Create New Coins
              </Button>
            </form>
          </div>
          {creating && (<div>Creating The Coins...</div>)}
        </Container>
    </div>)
}

export default Mint