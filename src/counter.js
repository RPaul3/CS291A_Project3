import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import {CTX} from './store'

const useStyles = makeStyles({
  counter: {
    margin: 10,
    color: '#fff',
    backgroundColor: red[800],
    position: 'absolute',
    top: '110px',
    right: '500px',

  },
});

export default function Counter() {

  const state = React.useContext(CTX);
  const classes = useStyles();

  return (
    <Grid container>
      <Avatar className={classes.counter}>{state.messageCounter}</Avatar>
    </Grid>
  );
}