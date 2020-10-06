import React from 'react'
import {Card, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
const useStyles = makeStyles((theme) => ({
    root: {
    },
    gridPiece:{
        padding: theme.spacing(10),
    }

  }));
export default function TicTacToeBoard({game, publicKey}){
    let classes = useStyles()
    const click0 = async () => {
        move(0)
    }
    const click1 = async () => {
        move(1)
    }
    const click2 = async () => {
        move(2)
    }
    const click3 = async () => {
        move(3)
    }
    const click4 = async () => {
        move(4)
    }
    const click5 = async () => {
        move(5)
    }
    const click6 = async () => {
        move(6)
    }
    const click7 = async () => {
        move(7)
    }
    const click8 = async () => {
        move(8)
    }
    
    const move = async (position) => {
        console.log(game)
        let tx = await game.move(publicKey, position)
        console.log(tx)
    }
    function PrintPlay(position){
        if(game.moves[position] === 0){return "Click To Select"}
        if(game.moves[position] === "O"){return "O"}
        if(game.moves[position] === "X"){return "X"}
    }
    return (
    <div> 
        <Grid container>
            {/* Row 1   */}
            <Grid item xs={4} align='center' className={classes.gridPiece} onClick={()=>{move(0)}}>Position 0 </Grid>
            <Grid item xs={4} align='center' className={classes.gridPiece} onClick={()=>{move(1)}}>Position 1 </Grid>
            <Grid item xs={4} align='center' className={classes.gridPiece} onClick={()=>{move(2)}}>Position 2 </Grid>
            <Grid item xs={4} align='center' className={classes.gridPiece} onClick={()=>{move(3)}}>Position 3 </Grid>
            <Grid item xs={4} align='center' className={classes.gridPiece} onClick={()=>{move(4)}}>Position 4 </Grid>
            <Grid item xs={4} align='center' className={classes.gridPiece} onClick={()=>{move(5)}}>Position 5 </Grid>
            <Grid item xs={4} align='center' className={classes.gridPiece} onClick={()=>{move(6)}}>Position 6 </Grid>
            <Grid item xs={4} align='center' className={classes.gridPiece} onClick={()=>{move(7)}}>Position 7 </Grid>
            <Grid item xs={4} align='center' className={classes.gridPiece} onClick={()=>{move(8)}}>Position 8 </Grid>
        </Grid>
    </div>) 
}