import React from "react";
import {
  useHistory
} from "react-router-dom";
import { Button} from '@material-ui/core'

function Login() {
  return (
  <div>
      Login Page
      <br/>
      <Button variant="contained" color="primary" href="/about">
        Link To About
      </Button>
  </div>
  )
}

export default Login
