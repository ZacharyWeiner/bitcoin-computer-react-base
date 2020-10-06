import React, {useEffect, useState} from 'react'
import {Button, Grid} from '@material-ui/core'
import TicTacToeBoard from './../components/TicTacToeBoard.js'
import Computer from 'bitcoin-computer'
import * as Constants from './../constants/LocalStorageConstants.js'
import AddressDetails from './../components/AddressDetails.js'
import FileUtilities from "../utilities/FileUtils"
import { SignalCellularNull } from '@material-ui/icons'

 function TicTacToe() {
    const [computer, setComputer] = useState(null)
    const [objects, setObjects] = useState(null)
    const [chain, setChain] = useState('BSV')
    const [address, setAddress] = useState('Loading...')
    const [balance, setBalance] = useState(0)
    const [publicKey, setPublicKey] = useState('Loading...')
    const [revs, setRevs] = useState([])
    const [gameID, setGameID] = useState(null)
    const [game, setGame] = useState(null)

    useEffect(()=>{
        const password = window.localStorage.getItem(Constants.SEED)
        const _path = Constants.TTT_PATH
        const setUpComputer = async (_password, __path) => {
            const _computer = await new Computer({seed: _password, path: __path, chain: "BSV", network: "testnet"})
            setComputer(_computer)
            setBalance(await _computer.db.wallet.getBalance())
            setPublicKey(await _computer.db.wallet.getPublicKey().toString())
            setAddress(await _computer.db.wallet.getAddress().toString())
           
        }
        const fetchRevs = async () =>{
            const _revs = await computer.getRevs(publicKey)
            setRevs(_revs)
            console.log(_revs)
        }
        if(!computer){
            setUpComputer(password, _path)
        }
        if(computer){
            fetchRevs()
        }
    }, [computer, publicKey])

    const newGame = async () => {
        let response = prompt("Add a seconds players Public Key")
        const TTCGame = await FileUtilities.importFromPublic('/contracts/TicTacToe.js')
        const token = await computer.new(TTCGame, [publicKey, response])
        console.log('Created token with id', token._id)
    }
    useEffect(() => {
        const getGame = async() => {
            const _rev = await computer.getLatestRev(gameID)
            console.log(_rev)
            const _game = await computer.sync(_rev)
            setGame(_game)
            console.log(_game._id)

        }
        if(computer && gameID){
           getGame()
        }
    },[computer, gameID])
    
    return(
    <div>
        <AddressDetails computer={computer} balance={balance} address={address} publicKey={publicKey} />
        <Grid container>
            <Grid item xs={12} md={4} lg={2}>
                {revs.map((r) => {
                    return (<Button key={r} onClick={(e) => {setGameID(r)}}> {r} </Button>)
                })}
                <Button onClick={newGame}> New Game </Button>
            </Grid>
            <Grid item xs={12} md={8} lg={10}>
                <TicTacToeBoard game={game} publicKey={publicKey}/> 
            </Grid>
        </Grid>
        
    </div>)
}
export default TicTacToe