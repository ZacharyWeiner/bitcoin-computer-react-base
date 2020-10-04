import React, { useState } from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Button, TextField} from '@material-ui/core'


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

function SendVote({ computer, votes }) {
  const [amount, setAmount] = useState(1)
  const [to, setTo] = useState('')

  const send = async (e) => {
        e.preventDefault()
        console.log(to)
        console.log(votes[0]._owners + "   " + votes[0].distributor)
        let tx = await votes[0].distribute(to)
        console.log('Sent vote to\n ' + to + '\n ' + tx.toString())
    }

    

  const classes = useStyles()
  return (
<form className={classes.form} noValidate  onSubmit={send}>
<TextField
  variant="outlined"
  margin="normal"
  required
  fullWidth='true'
  align='center'
  id="sendToPK"
  label="Send 1 Vote To Public Key"
  name="sendToPublickKey"
  value={to}
  onChange={(e) => setTo(e.target.value)}
  />

<Button
  type="submit"
  fullWidth
  variant="contained"
  color="primary"
  className={classes.submit}
>
  Send Vote
</Button>
</form>
    )
}

export default SendVote
