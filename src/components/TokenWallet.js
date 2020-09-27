import React from 'react'
import {Button, Card, CardContent, CardActions, Grid, Typography} from '@material-ui/core'
import SendTokens from './../components/SendToken.js'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { makeStyles } from '@material-ui/core/styles';
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


function TokenWallet({tokens, computer}){
    const [first] = tokens
    const balance = tokens.reduce((acc, token) => acc + parseInt(token.coins, 10), 0)

    let classes = useStyles()
    return(
        <Grid item xs={12}  className={classes.paper}>
            <Card style={{margin:'6px', outlineColor:'#000', color: '#000', outlineWidth:'2px'}}>
                <Grid container align='center'>
                    <Grid item xs={6}>
                        <Typography variant="h4" control="p" style={{paddingTop:'15%'}}><MonetizationOnIcon fontSize='large' color='primary'/> {first.name}</Typography>
                        <Typography variant="h6" control="p">Balance: {balance} coins</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <SendTokens tokens={tokens} computer={computer} />
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}

export default TokenWallet