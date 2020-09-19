import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Button, Link, Toolbar, Typography} from '@material-ui/core'


export default function Home() {
    let history = useHistory();
    history.push('/send-satoshis')
    const useStyles = makeStyles((theme) => ({
        '@global': {
          ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
          },
        },
        appBar: {
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
        toolbar: {
          flexWrap: 'wrap',
        },
        toolbarTitle: {
          flexGrow: 1,
        },
        link: {
          margin: theme.spacing(1, 1.5),
        },
        heroContent: {
          padding: theme.spacing(8, 0, 6),
        },
        cardHeader: {
          backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
        },
        cardPricing: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          marginBottom: theme.spacing(2),
        },
        footer: {
          borderTop: `1px solid ${theme.palette.divider}`,
          marginTop: theme.spacing(8),
          paddingTop: theme.spacing(3),
          paddingBottom: theme.spacing(3),
          [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
          },
        },
      }));
    
      const classes = useStyles();
      
  return (<div>Home<br/><Button variant="contained" color="primary" href="/about">
  Link
</Button></div>)
}

