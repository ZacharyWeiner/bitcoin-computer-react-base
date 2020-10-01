import React from 'react';
import {useHistory} from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';

export default function VoteMenu({classes}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  let history = useHistory()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button id="votebtn" aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick} variant="contained" color="default" className={classes.link}>
        Voting 
      </Button>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={(e)=>{history.push('/votables')}}>Up | Down Vote</MenuItem>
        <MenuItem onClick={(e)=>{history.push('/elections/')}}>My Election Votes</MenuItem>
        <MenuItem onClick={(e)=>{history.push('/elections/create')}}>Create An Election</MenuItem>
      </Menu>
    </div>
  );
}
