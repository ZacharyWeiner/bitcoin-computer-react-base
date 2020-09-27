import React from "react";
import {
  useHistory
} from "react-router-dom";
import { Button, Grid, Link, Typography} from '@material-ui/core'
import HomeCard from './../components/HomeCard.js'


export default function Home() {
  return (
          <div>
            <Grid container style={{paddingTop: "150px", paddingBottom: "100px", backgroundColor:"#000", color:"#fff"}} >
              <Grid item md={6} xs={12}  align='center'>
                <div>
                  <h1 align="center" className="script big-head">Yes.</h1>
                  <h1 align='center' className="roboto" >We can build </h1>
                  <h1 align='center'> <span className="script big-head" > Smart Contracts </span> <br />on Bitcoin.</h1>
                  <h4 align='center'> <Link style={{color:"#fff"}} href="www.bitcoincomputer.io" >With BitcoinComputer.io </Link></h4>
                </div>
              </Grid>
              <Grid item md={6} >
                <img src="https://www.cleveroad.com/images/article-previews/smart-contract-1.png" width="100%" />
              </Grid>
            </Grid>
            <h2 align='center' className="script" style={{padding:"24px"}}> What Can We Do With Smart Contracts On Bitcoin?</h2>
            <Grid container> 
              <Grid item xs={12} md={6}align="center" >
                <HomeCard image_url="https://www.finews.com/images/cache/b36e32165cdd55e625dbf64a6e15b2d2_w500_h300_cp.jpg" 
                                                    title="Coins" headText="Coins" description="Using Smart contracts you can create coins, that all have the same value, like money, and can easily be sent to or from your account." /></Grid> 
              <Grid item xs={12} md={6} align="center" 
                ><HomeCard image_url="https://vignette.wikia.nocookie.net/clashroyale/images/b/b0/Trade_Tokens.png/revision/latest?cb=20180903021928" headText="Tokens" description="Tokens are represent something that is unique. Some tokens like a token representing a car share a value, but each one is unique."/>
              </Grid> 
              <Grid item xs={12} md={4} align='center'>
                <HomeCard image_url="https://cdn1.vectorstock.com/i/1000x1000/58/45/new-chat-message-notification-icon-vector-22615845.jpg" headText="Chat" /></Grid>
              <Grid item xs={12} md={4} align='center'><HomeCard image_url="https://www.thebedfordcitizen.org/wp-content/uploads/2020/06/vote-464x464-1.png" headText='Voting'></HomeCard>   </Grid>
              <Grid item xs={12} md={4} align='center' ><HomeCard image_url="https://www.collinsdictionary.com/images/full/dice_393025615_1000.jpg" headText="Games" /> </Grid>
              <Grid item xs={12} style={{margin:'36px'}}><Button href='/send-satoshis' color='primary' variant='contained' fullWidth style={{padding:'18px'}} >Get Started</Button></Grid>
            </Grid> 
          </div>)
}

