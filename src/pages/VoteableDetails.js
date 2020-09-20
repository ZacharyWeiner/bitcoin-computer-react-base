import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import {Button} from '@material-ui/core'

function VoteableDetails(){
    const [refresh, setRefresh] = useState(null)
    const { id } = useParams()

}

export default VoteableDetails