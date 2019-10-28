import React, { Component } from 'react';
import './App.css';
import Dashboard from './dashboard.js'
import Popup from './model.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.eventSource = new EventSource("http://localhost:4567");
    this.state = {
      showPopup: true
    };
  }

handleSubmit(username, password){
    var xhr = new XMLHttpRequest();
    var FD  = new FormData();
    FD.append('username', username);
    FD.append('password', password);

    
    xhr.open("POST", 'http://localhost:4567/login', true);
    xhr.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 201) {
       console.log('it works!' + xhr.responseText);
    }
  };
    xhr.send(FD);
  }

togglePopup() {  
  this.setState({  
       showPopup: !this.state.showPopup  
  });  
}  

  componentDidMount() {
  this.eventSource.addEventListener("Disconnect", e =>
    e
  );

  this.eventSource.addEventListener("Message", e =>
    e
  );

  this.eventSource.addEventListener("Join", e =>
    e
  );

  this.eventSource.addEventListener("Part", e =>
    e
  );

  this.eventSource.addEventListener("ServerStatus", e =>
    e
  );

  this.eventSource.addEventListener("Users", e =>
    e
  );
}
 

    render() {
    return (

      <div className="App">
        {this.state.showPopup ?  
          <Popup  
            text='User Login'  
            closePopup={this.togglePopup.bind(this)}
            handleSubmit = {this.handleSubmit.bind(this)}  
          />  : null  
} 
        <Dashboard />
      </div>
    );
  }
}

export default App;
