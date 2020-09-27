import React, { useState, useEffect } from 'react'
import {Card, Grid, Typography} from '@material-ui/core'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { makeStyles } from '@material-ui/core/styles';

function AddressDetails({computer, address, publicKey, balance}){
    useEffect(() => {
        const fetchDetails = async => {

        }
    })
    return(<div>
        <Grid container align='center'>
            <Grid item xs={2}>
                <Card>
                    <LocalAtmIcon fontSize="large"/> <Typography variant='h5' control='p'>{balance} </Typography> <Typography variant='small' control='p'>Satoshis</Typography>
                </Card>
            </Grid>
            <Grid item xs={4}>
                <Card>
                    <AccountBalanceWalletIcon fontSize="large" /><Typography variant='h5' control='p'>{address}</Typography> <Typography variant='small' control='p'> Address </Typography>
                 </Card>
            </Grid>
            <Grid item xs={6}>
                <Card>
                <VpnKeyIcon fontSize="large" /> <Typography variant='h5' control='p'>{publicKey}</Typography> <Typography variant='small' control='p'>Public Key</Typography>
                </Card>
            </Grid>
        </Grid>
    </div>)
}

export default AddressDetails