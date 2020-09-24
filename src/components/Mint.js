import React, {useState, useEffect} from 'react'
import Computer from 'bitcoin-computer'
import {Button, Card, Grid} from '@material-ui/core'
import FileUtils from './../utilities/FileUtils.js'

function Mint({computer}){
    const [supply, setSupply] = useState(0)
    const [name, setName] = useState('')
    
 
    const handleSubmit = async (e) => {
        try{
            e.preventDefault()
            const pubKey = computer.db.wallet.getPublicKey().toString()
            const TOKEN = await FileUtils.importFromPublic('/contracts/Token.js')
            const newToken = await computer.new(TOKEN, [pubKey, supply, name])
            console.log(newToken)
            console.log("Successfully created " + newToken.coins + "of " + newToken.name + "Fungible Coins"  )
        }catch (err){
            if(err.message.startsWith('Insufficient balance in address')){
                alert(`You need testnet coins to mint a token. To get free testnet coins open the your wallet.`)
            } else {
                alert(err)
            }
        }
    }   
    return(<div> 
        <form onSubmit={handleSubmit}>
        <b>Supply</b><br />
            <input type="number" value={supply} onChange={(e) => setSupply(e.target.value)} /><br /><br />
            <b>Name</b><br />
            <input type="string" value={name} onChange={(e) => setName(e.target.value)} /><br /><br />
            <button type="submit">Mint</button>
        </form> 

        <div> Expected Supply: {supply} </div>
    </div>)
}

export default Mint