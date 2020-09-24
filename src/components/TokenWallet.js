import React from 'react'
import {Button, Card, Grid} from '@material-ui/core'
import SendTokens from './../components/SendToken.js'


function TokenWallet({tokens, computer}){
    const [first] = tokens
    const balance = tokens.reduce((acc, token) => acc + parseInt(token.coins, 10), 0)

    return(
        <Grid item xs={4}  >
            <Card>
             <h4>Token Name: {first.name}</h4>
            <h6>Token Balance: {balance}</h6>
            <SendTokens tokens={tokens} computer={computer} />
            </Card>
        </Grid>
    )
}

export default TokenWallet