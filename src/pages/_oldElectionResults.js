import React, {useEffect, useState} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import Computer from 'bitcoin-computer'
import useInterval from '../utilities/UseInterval'
import {Button, TextField, Typography} from '@material-ui/core'
import * as Constants from '../constants/LocalStorageConstants.js'

export default function ElectionResults(){
    const [revs, setRevs] = useState(null)
    const [objects, setObjects] = useState(null)
    const [election, setElection] = useState('')
    const [computer, setComputer] = useState(null)
    const [publicKey, setPublicKey] = useState(null)
    const [cand1PK, setCand1PK] = useState('')
    const [cand2PK, setCand2PK] = useState('')
    const [cand3PK, setCand3PK] = useState('')
    const [refresh, setRefresh] = useState(0)

    const { id } = useParams()

    useInterval(() => {

        // if you are currently logging in
        if (!computer){
          setComputer(new Computer({ chain: "BSV", network: 'testnet', seed: "spirit lift afford barrel orient elder fit short subject tide scatter auto", path: "m/44'/2'/0'/0"}))
          console.log("Bitcoin Computer created on BSV")
        // if you are currently logging out
        } 
  
        const refresh = async () => {
         let _revs;
          if (computer) {
            console.log('async initializing the  default computer')
            setPublicKey("02f0ec10c2eecb97cc7a5ac20397b01625a6828f441d2ffa7db3abf5beaf264724")
            _revs = await computer.getRevs("02f0ec10c2eecb97cc7a5ac20397b01625a6828f441d2ffa7db3abf5beaf264724")
            console.log("Loggin Revs: \n" + _revs)
            setRevs(_revs)
            
          }
        }
        refresh()
        const syncObjs = async (_revs) =>{
            let objs = await Promise.all(_revs.map(async rev =>  computer.sync(rev)))
            setObjects(objs)
        }
        if(revs){
            syncObjs(revs)
           
        }
        if(objects){
            console.log(objects[0])
        }
      }, 3000)

      const groupByRoot = (list) => list.reduce(
        (acc, obj) => ({
          ...acc,
          [obj['_rootId']]: (acc[obj['_rootId']] || []).concat(obj)
        }),
        {}
      )
   
    return (<div> 
                <Typography control='p' variant='body1'> Enter the public key of the candidate </Typography>
                <TextField defaultValue={publicKey} onBlur={(e)=> {setPublicKey(e.target.value)}} />
                {objects && Object.values(groupByRoot(objects)).length
                }
            </div>)
    
}