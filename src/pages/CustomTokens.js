import React, {useState, useEffect} from "react";
import Computer from 'bitcoin-computer'
import * as Constants from './../constants/LocalStorageConstants.js'
import {Button, Card, Grid} from '@material-ui/core'
import Mint from './../components/Mint.js'
import useInterval from './../utilities/UseInterval'
import TokenWallet from './../components/TokenWallet.js'

function CustomToken({_objects})
{
    const [computer, setComputer] = useState(null)
    const [objects, setObjects] = useState(_objects)
    const [chain, setChain] = useState('BSV')
  
    useInterval(() => {
      // BIP_39_KEY & CHAIN is set on login and we fetch it from local storage
      const password = window.localStorage.getItem(Constants.SEED)
      setChain("BSV")
  
      const isLoggedIn = password && chain
      // if you are currently logging in
      if (isLoggedIn && !computer){
        setComputer(new Computer({ chain: "BSV", network: 'testnet', seed: password }))
        console.log("Bitcoin Computer created on " + chain)
      // if you are currently logging out
      } else if (!isLoggedIn && computer){
        console.log("You have been logged out")
        setComputer(null)
      }

      const refresh = async () => {
        if (computer) {
          const revs = await computer.getRevs(computer.db.wallet.getPublicKey().toString())
          console.log(revs)
          let objs = await Promise.all(revs.map(async rev =>  computer.sync(rev)))
          setObjects(objs)
        }
      }
      refresh()
    }, 3000)
  
    
  
    const groupByRoot = (list) => list.reduce(
      (acc, obj) => ({
        ...acc,
        [obj['_rootId']]: (acc[obj['_rootId']] || []).concat(obj)
      }),
      {}
    )
  
    return (
        <div>
          <Mint computer={computer}></Mint>

            <Grid container>
            {objects && Object.values(groupByRoot(objects)).map((o) => 
             <TokenWallet key={o[0]._id} tokens={o} computer={computer} />
            )}
            </Grid>
        </div>
    )
  }
  
  export default CustomToken