import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Computer from 'bitcoin-computer'
import {Avatar, Button, Card, Container, CssBaseline, TextField, Typography, Grid} from '@material-ui/core'
import FileUtils from './../utilities/FileUtils.js'
import SendIcon from '@material-ui/icons/Send'

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      padding: theme.spacing(1),
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
  

function MintElection({computer}){
    const [votes, setVotes] = useState(0)
    const [title, setTitle] = useState('')
    const [election, setElection] = useState(null)
    const [creating, setCreating] = useState(false)
    const [can1name, setCan1Name] = useState('')
    const [can2name, setCan2Name] = useState('')
    const [can3name, setCan3Name] = useState('')
    const [can1PK, setCan1PK] = useState('')
    const [can2PK, setCan2PK] = useState('')
    const [can3PK, setCan3PK] = useState('')
 
    const handleSubmit = async (e) => {
        setCreating(true)
        // try{
            e.preventDefault()
            const pubKey = await computer.db.wallet.getPublicKey().toString()
            console.log("Public Key: " + pubKey)
            const ELECTION = await FileUtils.importFromPublic('/contracts/Vote.js')
            console.log(`Created Election From File \n ${ELECTION}`)
            let _election = await computer.new(ELECTION, [pubKey, pubKey, title, parseInt(votes, 10), can1name, can1PK, can2name, can2PK, can3name, can3PK])
            console.log("created Election on the blockchain. ")
            setElection(_election)
            console.log("set election complete")
            console.log(_election)
            console.log("Successfully created " + _election.votes + "for " + _election.name  )
        // }catch (err){
        //     if(err.message.startsWith('Insufficient balance in address')){
        //         alert(`You need testnet coins to mint a token. To get free testnet coins open the your wallet.`)
        //     } else {
        //         alert(err)
        //     }
        // }
        setCreating(false)
    }   
    const classes = useStyles()
    return(<div align='center'> 
        <Container component="main"  >
          <CssBaseline />
          <Card className={classes.paper} >
            <Avatar className={classes.avatar}>
              <SendIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Create An Election
            </Typography>
            <form className={classes.form} noValidate  onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="number"
                id="votes"
                label="How Many Votes Do You Want To Create in This Election?"
                name="votes"
                defaultValue={votes}  onChange={(e) => setVotes(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Title of Your Election"
                type="text"
                id="name"
                name="name" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Name of Candidate 1"
                type="text"
                id="can1name"
                name="can1name" 
                value={can1name}
                onChange={(e) => setCan1Name(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Public Key of of Candidate 1"
                type="text"
                id="can1PK"
                name="can1PK" 
                value={can1PK}
                onChange={(e) => setCan1PK(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Name of Candidate 2"
                type="text"
                id="can2name"
                name="can2name" 
                value={can2name}
                onChange={(e) => setCan2Name(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Public Key of of Candidate 2"
                type="text"
                id="can2PK"
                name="can2PK" 
                value={can2PK}
                onChange={(e) => setCan2PK(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Name of Candidate 3"
                type="text"
                id="can3name"
                name="can3name" 
                value={can3name}
                onChange={(e) => setCan3Name(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Public Key of of Candidate 3"
                type="text"
                id="can3PK"
                name="can3PK" 
                value={can3PK}
                onChange={(e) => setCan3PK(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Create New Election
              </Button>
            </form>
          </Card>
          {creating && (<div>Creating The Election...</div>)}
        </Container>
    </div>)
}

export default MintElection