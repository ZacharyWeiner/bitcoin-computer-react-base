import React from 'react'
import {Button, Grid, Card} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Computer from 'bitcoin-computer'

function NonFungibleTokenCard({computer, token}){
    const handleClick = async (e) =>{
        let prompt_response =  prompt("Enter The New Owners Address");
        console.log(token.sendTo(prompt_response))
    }
    return (
        <Grid item xs={3}>
            <h5>{token.name}</h5>
            <p>{token.description}</p>
            <Button href={token.url}  >View</Button>
            <Button onClick={handleClick} variant='contained' color='secondary'>Send</Button>
        </Grid>
    )
}

export default NonFungibleTokenCard