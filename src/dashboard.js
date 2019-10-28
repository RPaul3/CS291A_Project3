import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';  
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  root: {
    margin: "100px",
    padding: theme.spacing(3, 2),
  },

  flex:{
    display:'flex',
    alignItems:'center'
  },

  userWindow:{
    width:'30%',
    height: '500px',
    borderRight: '1px solid black'
  },

  chatWindow:{
    width:'70%',
    height: '500px',
    padding:'30px'
  },

  chatBox:{
    width:'85%'
  },

  button:{
    width:'15%'
  }

}));

export default function Dashboard() {
  const classes = useStyles();
  const [textValue, changeTextValue] = React.useState('');

  return (
    <div>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3">
          Chat App
        </Typography>

        <Typography component="p">
          Placeholder
        </Typography>

        <div className={classes.flex}>
          <div className={classes.userWindow}>
            <List>
            {
              ['user1'].map(user => 
              (
                <ListItem key = {user} button>
                  <ListItemText primary= {user} />
                </ListItem>
              ))
            }
            
            

            </List>

          </div>

          <div className={classes.chatWindow}>

          {
            [{from: "user", msg: "hello"}].map((chat, i) => (
              <div className={classes.flex} key={i}>
                <Chip label={chat.from} className={classes.chip} />
                <Typography component="p">{chat.msg}</Typography>
              </div>
              ))
          }

          </div>
        </div>

        <TextField  
          label="send a message"
          className={classes.chatBox}
          value={textValue}
          onChange={e => changeTextValue(e.target.value)}
        />

        <Button variant="contained" color="primary" className={classes.button}>
          Send
        </Button>


      </Paper>
    </div>
  );
}