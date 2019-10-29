import React, { Component } from 'react';
import './App.css';
import Dashboard from './dashboard'
import Popup from './model'
import Store,  {CTX} from './store'

class App extends Component {

  static contextType = CTX

  constructor(props) {
    super(props);
    this.eventSource = '';
    this.state = {
      showPopup: true,
      history: [],
      users:[]
    };
    //this.startEventSource = this.startEventSource.bind(this);
    this.sendMessage = this.sendMessage.bind(this);



  }

sendMessage = (message) => {
  console.log('sendMessage', message);
}


/*
startEventSource(token) {
  //const msg = this.context
  //console.log(msg)
  console.log("eventSource started")
  this.eventSource = new EventSource(`http://localhost:4567/stream/${token}`);
  
  
   this.eventSource.addEventListener("Disconnect", e =>
    this.setState({history: [...this.state.history, JSON.parse(e.data).created + " " + "Disconnect"]})
    );

    this.eventSource.addEventListener("Message", e =>
      this.setState({history: [...this.state.history, JSON.parse(e.data).created + " " + JSON.parse(e.data).user + " " + JSON.parse(e.data).message + "Message"]})
    );

    this.eventSource.addEventListener("Join", e =>{
      var msg = JSON.parse(e.data).created + " " + JSON.parse(e.data).user + " " + "JOIN";
      this.setState({history: [...this.state.history,msg]})
    }
    );

    this.eventSource.addEventListener("Part", e =>
      this.setState({history: [...this.state.history, JSON.parse(e.data).created + " " + JSON.parse(e.data).user + " " + "Part"]})
    );

    this.eventSource.addEventListener("ServerStatus", e =>
      this.setState({history: [...this.state.history, JSON.parse(e.data).created + " " + JSON.parse(e.data).status + " " + "ServerStatus"]})
    );

    this.eventSource.addEventListener("Users", e =>
      this.setState({history: [...this.state.history, JSON.parse(e.data).created + " " + JSON.parse(e.data).users + " " + "Users"]})
    );
}*/



handleSubmit(username, password){


    this.setState({  
       showPopup: !this.state.showPopup  
    }); 
    /*
    var xhr = new XMLHttpRequest();
    var FD  = new FormData();
    FD.append('username', username);
    FD.append('password', password);

    
    xhr.open("POST", 'http://localhost:4567/login', true);
    xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 201) {
       var jsonResponse = JSON.parse(xhr.responseText);
       this.startEventSource(jsonResponse["token"])
    }
  };
    xhr.send(FD);*/
  }



 

    render() {
    return (
      <Store>
      <div className="App">
        {this.state.showPopup ?  
          <Popup  
            text='User Login' 
            handleSubmit = {this.handleSubmit.bind(this)}  
          />  : null  
        } 
          <Dashboard />
        
      </div>
      </Store>
    );
  }
}

export default App;
