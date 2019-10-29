import React from 'react'

export const CTX = React.createContext({
    msg:[{"event":"ServerStatus", "created":"2019-10-28 03:16:10 -0700", "user":"", "message":"", "status":"started"}
    ,{"event":"ServerStatus", "created":"2019-10-28 03:16:10 -0900", "user":"", "message":"", "status":"startedAgain"}],
    user:["user1", "Sekiro", "Gehrman"],
    addMsg: () => {},
    addUser: () => {},
    deleteUser: () => {},
    setToken:() => {},
    authToken:''
});


/*
function reducer(state, action){
		return{ 
			...state,
	        arr: [...state.arr, action.newItem]
		}
}
*/

function sendChatAction(value){

}

export default function Store(props){

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
		var newState = {...state} 
		newState.user = newState.user.filter(user => user !== partedUser)
		setState({newState})
	}

	const initState = {
		msg:[{"event":"ServerStatus", "created":"2019-10-28 03:16:10 -0700", "user":"", "message":"", "status":"started"}
    	,{"event":"ServerStatus", "created":"2019-10-28 03:16:10 -0900", "user":"", "message":"", "status":"startedAgain"}],	    
        user:["user1", "Sekiro", "Gehrman"],
	    addMsg: addMsg,
	    addUser: addUser,
	    setToken: setToken,
	    authToken:''
	}


	const [state, setState] = React.useState(initState)

	return (
		<CTX.Provider value = {state}>
			{props.children}
		</CTX.Provider>
	)
} 