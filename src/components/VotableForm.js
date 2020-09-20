import React, {useState} from 'react'
import {Button, Grid, TextField} from '@material-ui/core'

function VotableForm({computer}){
    const [voter_addresses, setVoterAddresses] = useState([])
    const [description, setDescription] = useState('')
    const [recipient_address, setRecipientAddress] = useState('')
    const [value, setValue] = useState(0)
    const handleBlur = async (e) => {
        if(e.target.name === "voter_addresses" ){
            setVoterAddresses(e.target.value.split(","))
        } else if(e.target.name === "description" ){
            setDescription(e.target.value)
        } else if(e.target.name === "recipient_address" ){
            setRecipientAddress(e.target.value)
        } else if(e.target.name === "value" ){
            setValue(e.target.value)
        }
    }
    const send = async (e) => {
        e.preventDefault()
        console.log(voter_addresses)
        console.log(description)
        console.log(recipient_address)
        console.log(value)
    }
    return (
        <div>
            <h2> New Vote Contract</h2>
            <form onSubmit={send}>
            <Grid container spacing={2}> 
                <Grid item xs={12}  style={{padding: "8px"}}>
                    <TextField fullWidth defaultValue={voter_addresses} name="voter_addresses" onBlur={handleBlur} helperText="Addresses For Voters" placeholder="xHylsakdhjfihsdfhfsn378r6, akdhfnafasdhfalshfhlajhfd, ..."/>
                </Grid>
                <Grid item xs={12}  style={{padding: "8px"}}>
                    <TextField fullWidth rows={3}  defaultValue={description} name="description" onBlur={handleBlur} placeholder="Engaging Nomadic Creative For Marketing" helperText="Description of the thing youre voting on"/>
                    {/* <TextareaAutosize width="100%" rowsMin={3}  defaultValue={description} name="description" onBlur={handleBlur} placeholder="Description of the thing youre voting on" helperText="Engaging Nomadic Creative For Marketing"/> */}
                </Grid>
                <Grid item xs={12} style={{padding: "8px"}}>
                    <TextField fullWidth defaultValue={recipient_address} name="recipient_address" onBlur={handleBlur} helperText="Send Funds To This Vendor Address" placeholder="xHylsakdhjfihsdfhfsn378r6"/>
                </Grid>
                <Grid item xs={12} style={{padding: "8px"}}>
                    <TextField fullWidth defaultValue={value} type="number" name="value" onBlur={handleBlur} helperText="Total Amount To Payout" placeholder="100000"/>
                </Grid>
            </Grid>
            <Button type="submit" >Create Votable</Button>
            </form>
        </div>
    )
}

export default VotableForm