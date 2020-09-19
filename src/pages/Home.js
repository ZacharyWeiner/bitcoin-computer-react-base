import React from "react";
import {
  useHistory
} from "react-router-dom";
import { Button} from '@material-ui/core'


export default function Home() {
    let history = useHistory();
    history.push('/send-satoshis')
  return (<div>Home<br/><Button variant="contained" color="primary" href="/about">
  Link
</Button></div>)
}

