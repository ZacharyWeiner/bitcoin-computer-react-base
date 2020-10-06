import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Button, Card, CardContent, CardActions, Grid, Typography} from '@material-ui/core'
import SendVote from './../components/SendVote.js'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      padding: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    paddedPaper: {
      marginTop: theme.spacing(2),
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

function VoteWallet({votes, computer, publicKey, rev}){
    const [first] = votes
    const balance = votes.reduce((acc, token) => acc + parseInt(token.votes, 10), 0)
    const [distribute, setDistribute] = useState(false)
    const [vote, setVote] = useState(null)

    let classes = useStyles()
    // useEffect(()=>{
    //   const setUp = async () => {
    //     console.log('rev ' + rev)
    //     console.log(votes[0].distributor + " " + publicKey + "" + votes[0].can1PK)
    //     if(votes[0].distributor === publicKey){
    //       setDistribute(true)
    //     }
    //     let _vote = await computer.sync(rev)
    //     console.log(_vote)
    //     setVote(_vote)
    //   }
    //   setUp()
    // }, [votes, publicKey, rev, computer])

    useEffect(()=>{
      console.log(votes[0].distributor + " " + publicKey + "" + votes[0].cand1PK)
    })

    const candidate1Click = async (e) =>{
      try{
        let tx = await first.voteA(publicKey)
        console.log(tx)
      }catch(err){alert(err)}
    }

    const candidate2Click = async (e) =>{
      let tx = await first.voteB(publicKey)
      console.log(tx)
    }

    const candidate3Click = async (e) =>{
      let tx = await first.voteC(publicKey)
      console.log(tx)
    }


   
   const history = useHistory()
    return(
        <Grid item xs={12}  className={classes.paddedPaper}>
            <Card style={{margin:'6px', outlineColor:'#000', color: '#000', outlineWidth:'2px'}}>
                <Grid container align='center' className={classes.paddedPaper}>
                    <Grid item xs={12}>
                        <Typography variant="h4" control="p" ><MonetizationOnIcon fontSize='large' color='primary'/> {first.name}</Typography>
                        <Typography variant="h6" control="p">{balance} undistributed votes</Typography>
                        <Typography variant="body1" control="p">{first._id}</Typography>
                        <Button onClick={(e)=>{history.push('/elections/results/'+first._id)}} variant='contained' color='secondary'>View Results</Button>
                    </Grid>
                    <Grid item xs={12}>
                      
                      {(votes[0].distributor === publicKey) 
                        ? ( 
                          <div className={classes.paddedPaper}><SendVote votes={votes} computer={computer} /></div>
                        ) : (
                          <div>
                            <div> Cast Your Vote For: </div>
                            <Grid container> 
                              <Grid item xs={12} md={4}>
                                <Button onClick={candidate1Click} > {first.can1name}</Button> 
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Button  onClick={candidate2Click}> {first.can2name} </Button>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Button  onClick={candidate3Click}> {first.can3name} </Button>
                              </Grid>
                            </Grid>
                          </div>
                        )
                      } 
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}

export default VoteWallet