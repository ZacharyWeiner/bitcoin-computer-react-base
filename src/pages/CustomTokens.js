import React, {useState, useEffect} from "react";
import {useParams} from 'react-router-dom'
import Computer from 'bitcoin-computer'
import * as Constants from './../constants/LocalStorageConstants.js'
import {Button, Card, Grid} from '@material-ui/core'
import Mint from './../components/Mint.js'
import useInterval from './../utilities/UseInterval'
import TokenWallet from './../components/TokenWallet.js'
import AddressDetails from './../components/AddressDetails.js'

function CustomToken({_objects})
{
    const [computer, setComputer] = useState(null)
    const [objects, setObjects] = useState(_objects)
    const [chain, setChain] = useState('BSV')
    const [address, setAddress] = useState('Loading...')
    const [balance, setBalance] = useState(0)
    const [publicKey, setPublicKey] = useState('Loading...')
    const { id } = useParams()
  
    useInterval(() => {
      // BIP_39_KEY & CHAIN is set on login and we fetch it from local storage
      const password = window.localStorage.getItem(Constants.SEED)
      setChain("BSV")
  
      const isLoggedIn = password && chain
      // if you are currently logging in
      if (isLoggedIn && !computer){
        setComputer(new Computer({ chain: "BSV", network: 'testnet', seed: password, path: Constants.TOKENS_PATH }))
        console.log("Bitcoin Computer created on " + chain)
      // if you are currently logging out
      } else if (!isLoggedIn && computer){
        console.log("You have been logged out")
        setComputer(null)
      }

      const refresh = async () => {
        if (computer) {
          let a = await computer.db.wallet.getAddress().toString()
          setAddress(a)
          let b = await computer.db.wallet.getBalance()
          setBalance(b)
          console.log('async initializing the  default computer')
          setPublicKey(await computer.db.wallet.getPublicKey().toString())

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
          <AddressDetails computer={computer} balance={balance} address={address} publicKey={publicKey} />
          <Grid container> 
            <Grid item xs={12} md={4} align='center'>
              <Mint computer={computer}></Mint>
            </Grid>
            <Grid item md={8}>
              <Grid container>
                {objects && Object.values(groupByRoot(objects)).map((o) => 
                <TokenWallet key={o[0]._id} tokens={o} computer={computer} />
                )}
              </Grid>
            </Grid>
          </Grid>
        </div>
    )
  }
  
  export default CustomToken