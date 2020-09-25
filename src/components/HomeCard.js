import React from 'react';
import {useHistory} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export default function HomeCard({image_url, title,  headText, description, link_path, linkText, alt}) {
  const classes = useStyles();
  const history = useHistory();
  const handleClick = () => {
    history.push(link_path)
}
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={alt}
          image={image_url}
          title={title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {headText}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={handleClick}>
        {linkText}
        </Button>
      </CardActions>
    </Card>
  );
}