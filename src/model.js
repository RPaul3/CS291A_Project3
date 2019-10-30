import React from 'react'; 
import {CTX} from './store'



class Popup extends React.Component {  

static contextType = CTX


constructor(props) {
    super(props);
    this.state = {username: '', password: '', showPopup: true,};
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.startEventSource = this.startEventSource.bind(this);
 }



 startEventSource(token) {
  
  console.log("eventSource started")
  //this.eventSource = new EventSource(`http://chat.cs291.com/stream/${token}`);
  this.eventSource = new EventSource(`http://localhost:4567/stream/${token}`);
  const msg = this.context.msg
  
  const messageAdder = this.context.addMsg
  const userAdder = this.context.addUser
  const userDeleter = this.context.deleteUser
  const setShowCounter = this.context.setShowCounter
  const messageCounterAdder = this.context.messageCounterAdder
  const clearUsers = this.context.clearUsers
  
   this.eventSource.addEventListener("Disconnect", e =>{
	  var jsonData = JSON.parse(e.data)
  	messageAdder({"event":"Disconnect", "created":`${jsonData.created}`, "user":"", "users":"", "message":"", "status":""})
  	console.log("Disconnect")
    this.eventSource.close()
    
    clearUsers()
    console.log("curr u are " + this.context.user.length)
    
    
    console.log("show is before " + this.context.showCounter)
    setShowCounter()
    console.log("show is after " + this.context.showCounter)
    this.props.handleSubmit()
	}	
   ); 

    this.eventSource.addEventListener("Message", e =>{
    	var jsonData = JSON.parse(e.data)
		messageAdder({"event":"Message", "created":`${jsonData.created}`, "user":`${jsonData.user}`, "users":"", "message":`${jsonData.message}`, "status":""})
		messageCounterAdder()
    console.log("Message from: " + jsonData.user )  
		}  

	);

    this.eventSource.addEventListener("Join", e =>{
      var jsonData = JSON.parse(e.data)
      messageAdder({"event":"Join", "created":`${jsonData.created}`, "user":`${jsonData.user}`, "users":"", "message":"", "status":""})
      if (!this.context.user.includes(jsonData.user)){
        userAdder(jsonData.user)
      }
        
	  console.log("Join")    
	  }
    );

    this.eventSource.addEventListener("Part", e =>{
      var jsonData = JSON.parse(e.data)
      messageAdder({"event":"Part", "created":`${jsonData.created}`, "user":`${jsonData.user}`, "users":"", "message":"", "status":""})
	    userDeleter(jsonData.user)
      console.log("Part") }

	   );

    this.eventSource.addEventListener("ServerStatus", e =>{
	  var jsonData = JSON.parse(e.data)
      messageAdder({"event":"ServerStatus", "created":`${jsonData.created}`, "user":"", "users":"", "message":"", "status":"server started"})
	    console.log("ServerStatus") 
	}
   );

    this.eventSource.addEventListener("Users", e =>{
      var jsonData = JSON.parse(e.data)
      messageAdder({"event":"Users", "created":`${jsonData.created}`, "user":"", "users":`jsonData.users`, "message":"", "status":""})
	    var users = jsonData.users
      for(var i = 0; i < users.length; i++){
        console.log("add " + (users[i]))
        userAdder(users[i])
      }
       console.log("Users")
	}
    );
}

 handleChangeUsername(event) {
    this.setState({username: event.target.value});
 }

 handleChangePassword(event) {
    this.setState({password: event.target.value});
 }

handleSubmit(event){
	const setShowCounter = this.context.setShowCounter
	event.preventDefault();
	//this.props.handleSubmit(this.state.username, this.state.password);
    var xhr = new XMLHttpRequest();
    var FD  = new FormData();
    FD.append('username', this.state.username);
    FD.append('password', this.state.password);
    
    
    //xhr.open("POST", 'http://chat.cs291.com/login', true);
    xhr.open("POST", 'http://localhost:4567/login', true);
    xhr.onreadystatechange = (tokenSetter) => {
    if (xhr.readyState === 4 && xhr.status === 201) {
    	const tokenSetter = this.context.setToken
       var jsonResponse = JSON.parse(xhr.responseText);
       this.startEventSource(jsonResponse["token"]);
       tokenSetter(jsonResponse["token"])
       setShowCounter()
    }
  };
    xhr.send(FD);
    this.props.handleSubmit()
    //tokenSetter(tk);
}

render() {  
	const popupStyle = {  
  position: 'fixed',  
  width: "100%",  
  height: "100%",  
  top: '0',  
  left: '0',  
  right: '0',  
  bottom: '0',  
  margin: 'auto', 
  backgroundColor: "grey",  
} ;

const popupInnerStyle = {  
  position: 'absolute',  
  left: '25%',  
  right: '25%',  
  top: '25%',  
  bottom: '25%', 
  margin: 'auto',  
  borderRadius: '20px',  
  background: 'white',  
} ;

	return (  
	<div style={popupStyle} className='popup'>  
		<div style={popupInnerStyle} className='popupInner'>  
			<h1>{this.props.text}</h1>  
			<form onSubmit={this.handleSubmit}>
				username: 
			    <input type="text" name="username" onChange={this.handleChangeUsername}/>
			    <br/>
			    password: 
			    <input type="text" name="password" onChange={this.handleChangePassword}/>
			     <br/>
			    <input type="submit" value="Submit" />
			</form>  
		</div>  
	</div> 
	); }  
}  

export default Popup;