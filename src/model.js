import React from 'react'; 



class Popup extends React.Component {  

constructor(props) {
    super(props);
    this.state = {username: '', password: ''};

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
 }

 handleChangeUsername(event) {
    this.setState({username: event.target.value});
 }

 handleChangePassword(event) {
    this.setState({password: event.target.value});
 }

handleSubmit(event){
	event.preventDefault();
	this.props.handleSubmit(this.state.username, this.state.password);
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