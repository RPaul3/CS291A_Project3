import React from 'react'

export const CTX = React.createContext({
    msg:[],
    user:[],
    clearUsers: () => {},
    addMsg: () => {},
    addUser: () => {},
    deleteUser: () => {},
    setToken:() => {},
    setShowCounter:() => {},
    messageCounterAdder:() => {},
    authToken:'',
    messageCounter:0,
    showCounter:false
});



export default function Store(props){

	const clearUsers = () =>{
		console.log("before call user " + state.user.length)
		state.user = []
		console.log("after call user " + state.user.length)
	}

	const setShowCounter = () => {
		console.log("before call stateCounter " + state.showCounter)
		state.showCounter = !state.showCounter
		console.log("after call stateCounter " + state.showCounter)
	}

	const messageCounterAdder = () =>{
		state.messageCounter = state.messageCounter+1
	}

	const addMsg = (newMsg) =>{
		var newArray = state.msg;
		newArray.push(newMsg);  
		setState({...state , msg:newArray})
	}

	const addUser = (newUser) =>{
		var newArray = state.user;
		newArray.push(newUser);  
		setState({...state, user:newArray})
	}

	const setToken = (token) =>{
		state.authToken = token
	}

	const deleteUser = (partedUser) =>{
		var newArray = state.user; 
		var index = newArray.indexOf(partedUser);
		if (index !== -1) newArray.splice(index, 1);
		setState({...state, user:newArray})
	}

	const initState = {
		msg:[],	    
        user:[],
        clearUsers: clearUsers,
	    addMsg: addMsg,
	    addUser: addUser,
	    setToken: setToken,
	    setShowCounter: setShowCounter,
	    deleteUser:deleteUser,
	    messageCounterAdder:messageCounterAdder,
	    authToken:'',
	    messageCounter:0,
	    showCounter:false
	}


	const [state, setState] = React.useState(initState)

	return (
		<CTX.Provider value = {state}>
			{props.children}
		</CTX.Provider>
	)
} 