import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Computer from 'bitcoin-computer'

export default function SendTest() {
    const send = async (e) => {
        e.preventDefault()
       const computer = new Computer({
          seed: "skill canyon suffer cradle valve style buzz burger dinosaur inflict manual lawn",
          chain: "BSV", // BSV or BCH
          network: "testnet" // testnet or livenet
          //path: "m/44'/0'/0'/0" // defaults to "m/44'/0'/0'/0"
        })
    
       console.log('async starting')
       const {db } = computer 
       const { wallet } = db
        const address = wallet.getAddress()
        
        const addressString = address.toString()
        console.log(addressString)
        console.log(await wallet.getBalance())
        const pubKey =  wallet.getPublicKey()
        const revs = await computer.getRevs(pubKey)
        console.log(revs)
        //const rev1 = await computer.getLatestRev(revs[0])
        let revSync = await computer.sync(revs[0])
        console.log(revSync)
        console.log(await computer.db.wallet.send(parseInt(1, 10), "mzLCDuLoaT6VcSJ129G9boNJ5Pd6q6At4p"));
        //console.log(txID);
        console.log("async ended")
    }
  return (<div>Send Test Page<form onSubmit={send} >
    <button type='submit'>Test Send</button>
  </form></div>)
}

