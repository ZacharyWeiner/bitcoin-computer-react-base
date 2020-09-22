import React, {useState} from 'react'
import {Button, Grid} from '@material-ui/core'

function NonFungibleTokenCard({computer, token}){
    const [loading, setLoading] = useState(false)
    const handleClick = async (e) =>{
        setLoading(true)
        let prompt_response =  prompt("Enter The New Owners Public Key");
        console.log(await token.sendTo(prompt_response))
        setLoading(false)
    }
    return (
        <Grid item xs={3}>
            <h5>{token.name}</h5>
            <p>{token.description}</p>
            <Button href={token.url}  >View</Button>
            <Button onClick={handleClick} variant='contained' color='secondary'>Send</Button>
            {loading && (<p> Sending ... </p>)}
        </Grid>
    )
}

export default NonFungibleTokenCard