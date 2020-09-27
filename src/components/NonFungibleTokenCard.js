import React, {useState} from 'react'
import {Button, Card, Grid} from '@material-ui/core'
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

function NonFungibleTokenCard({computer, token}){
    const [loading, setLoading] = useState(false)
    const handleClick = async (e) =>{
        setLoading(true)
        let prompt_response =  prompt("Enter The New Owners Public Key");
        if (prompt_response.length > 0 ){
            console.log(await token.sendTo(prompt_response))
        }
        setLoading(false)
    }
    return (
        <Grid item xs={4} align='center' >
            <Card style={{margin:'4px'}}>
            <CardActionArea>
                <CardMedia component="img"
                    alt="Token Card Image"
                    height="140"
                    image={token.url}
                    title="Token Image"
                    />
                <h5>{token.name}</h5>
                <p>{token.description}</p>
            </CardActionArea>
            <CardActions>
            <Button onClick={handleClick} variant='contained' color='secondary'>Send</Button>
                {loading && (<p> Sending ... </p>)}
            </CardActions>
            </Card>
        </Grid>
    )
}

export default NonFungibleTokenCard