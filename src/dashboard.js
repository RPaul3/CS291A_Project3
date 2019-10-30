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
import {CTX} from './store'
import Counter from './counter'

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
    borderRight: '1px solid black',
    overflowY: 'scroll'
  },

  chatWindow:{
    width:'70%',
    height: '500px',
    padding:'30px',
    overflowY: 'scroll'
  },

  chatBox:{
    width:'85%'
  },

  button:{
    width:'15%'
  }

}));

function sendMessage(value, token){

  //console.log("The passed in token is " + token)
  var xhr = new XMLHttpRequest();
  xhr.open("POST", 'http://localhost:4567/message', true);
  var FD  = new FormData();
  FD.append('message', value);
  xhr.setRequestHeader('Authorization', `Bearer ${token}`);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 201) {
       console.log("Message sent:" + value)
    }
  };
    xhr.send(FD);

}


export default function Dashboard() {
  const classes = useStyles();
  const state = React.useContext(CTX);
  const [textValue, changeTextValue] = React.useState('');

  return (
    <div>
      <Paper className={classes.root}>
        <Typography variant="h5" component="h3">
          Chat App
        </Typography>
 
        <Typography component="p">
          CS291A
        </Typography>

        {state.showCounter ?  
          <Counter/> :  null 
        } 
        
        <div className={classes.flex}>
          
          <div className={classes.userWindow}>
            <List>
            {
              state.user.map(user => 
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
            state.msg.map((chat, i) => (
              <div className={classes.flex} key={i}>
                <Chip label={chat.user} className={classes.chip} />
                <Typography component="p">{chat.created} {chat.event} {chat.user} {chat.message} {chat.status} </Typography>
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

        <Button 
          variant="contained" 
          color="primary" 
          className={classes.button}
          onClick ={() => {
            {sendMessage(textValue, state.authToken)};
            changeTextValue('');
          }

          } 
        >
          Send
        </Button>


      </Paper>
    </div>
  );
}