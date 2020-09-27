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

function SendToken({ computer, tokens }) {
  const [amount, setAmount] = useState(0)
  const [to, setTo] = useState('')

  const send = async (e) => {
    e.preventDefault()

    const balance = tokens.reduce((acc, token) => acc + parseInt(token.coins, 10), 0)
    if(amount > balance) throw new Error('Insuficient Funds')

    tokens.sort((a, b) => (a.coins - b.coins))
    const newTokens = []
    let leftToSpend = amount
    for (const token of tokens) {
      const tokenCoins = parseInt(token.coins, 10)
      console.log(leftToSpend.toString() + " " + tokenCoins.toString() + " " + to)
      if (0 < leftToSpend && 0 < tokenCoins) {
        newTokens.push(await token.send(Math.min(leftToSpend, tokenCoins), to))
        leftToSpend -= tokenCoins
      }
    }

    console.log('Sent tokens\n', newTokens.map(token => `${token.coins} -> ${token._owners[0]}`).join('\n'))
  }
  const classes = useStyles()
  return (
<form className={classes.form} noValidate  onSubmit={send}>
<TextField
  variant="outlined"
  margin="normal"
  required
  fullWidth
  id="sendToPK"
  label="Send To Public Key"
  name="sendToPublickKey"
  value={to}
  onChange={(e) => setTo(e.target.value)}
  />
<TextField
  variant="outlined"
  margin="normal"
  required
  fullWidth
  label="Amount"
  type="number"
  id="amount"
  name="amount" 
  value={amount}  
  onChange={(e) => setAmount(e.target.value)}
/>
<Button
  type="submit"
  fullWidth
  variant="contained"
  color="primary"
  className={classes.submit}
>
  Send Tokens
</Button>
</form>
    )
}

export default SendToken
