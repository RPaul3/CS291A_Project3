import React, { Component } from 'react';
import './App.css';
import Dashboard from './dashboard'
import Popup from './model'
import Store,  {CTX} from './store'

class App extends Component {

  static contextType = CTX

  constructor(props) {
    super(props);
    this.state = {
      showPopup: true,
      history: [],
      users:[]
    };
    this.sendMessage = this.sendMessage.bind(this);



  }

sendMessage = (message) => {
  console.log('sendMessage', message);
}


handleSubmit(){
    this.setState({  
       showPopup: !this.state.showPopup  
    }); 
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
