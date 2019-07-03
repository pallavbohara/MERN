import React, { Component } from "react";
import axios from 'axios'

class App extends Component {
	//initialize our state
	state = {
		data: [],
		id: 0,
		message: null,
		intervalIsSet: false,
		idToDelete: null,
		idToUpdate: null,
		objectToUpdate: null,
	};
	//when component mounts, first thing it does os fetch all existing data in our db
	// then we incorporate a polling logic so that we can easily see if our db has
	// changed and implement those changes into our UI
	componentDidMount(){
		this.getDataFromDb();
		if(!this.state.intervalIsSet){
			let interval = setInterval(this.getDataFromDb,1000);
			this.setState({intervalIsSet:interval});
		}
	}

	//never let a process live forever
	// always kill a process everytime we are done using it
	componentWillUnmount(){
		if(this.state.intervalIsSet)
		{
			clearInterval(this.state.intervalIsSet);
			this.setState({intervalIsSet:null});
		}
	}

// our first get method that uses our backend api to
// fetcj data from our data base
getDataFromDb = () =>{
	fetch('http://localhost:3001/api/getData')
	.then((data)=>data.json())
	.then((res)=>this.setState({data:res.data}));
};

//our put method that uses our backend api
//to create new query into our data base
putDataToDB = (message)=>{
	let currentIds = this.state.data.map((data)=>data.id);
	let idToBeAdded = 0;
	while(currentIds.includes(idToBeAdded))
	{
		++idToBeAdded;
	}
	axios.post('http://localhost:3001/api/putData',{
		id: idToBeAdded,
		message: message,
	});
};

//our delete method that uses our backend api
//to remove existing database information
deleteFromDb = (idToDelete)=>{
	parseInt(idToDelete);
	let objIdToDelete = null;
	this.state.data.forEach((dat)=>{
		if(dat.id == idToDelete){
			objIdToDelete = dat._id;
		}
	});	

	axios.delete('http://localhost:3001/api/deleteData',{
		data:{
			id: objIdToDelete,
		},
	});
};

//our update method that uses our backend api
//to overwrite existing data base information
updateDB = (idToUpdate,updateToApply)=>{
	let objIdToUpdate = null;
	parseInt(idToUpdate);
	this.state.data.forEach((dat)=>{
		if(dat.id==idToUpdate){
			objIdToUpdate = dat._id;
		}
	});
	axios.post('http://localhost:3001/api/updateData',{
		id: objIdToUpdate,
		update: { message: updateToApply },

	});
};
render()
{
	const {data} = this.state;
	return(
		<div>
			<ul>
				{
					data.length<=0
				?'No DB entries Yet'
				:data.map((dat)=>(
					<li style={{padding:'10px'}} key={data.message}>
						<span style={{color:'gray'}}> id: </span> {dat.id} <br/>
						<span style={{color:'gray'}}> message: </span>
						{dat.message}
					</li>
				))}
			</ul>
			<div style={{padding:'10px'}}>
					<input
					type = 'text'
					onChange ={(e)=>this.setState({message:e.target.value})}
					placeholder = "add something in database"
					style={{width:'200px'}}
					/>
					<button onClick={()=>this.putDataToDB(this.state.message)}>
						ADD
					</button>
			</div>
			<div style={{padding:'10px'}}>
					<input
					type = 'text'
					style = {{width:'200px'}}
					onChange = {(e)=>this.setState({idToDelete:e.target.value})}
					placeholder = "put id of item to remove"
					/>
					<button onClick={()=>this.deleteFromDb(this.state.idToDelete)}>
						DELETE
					</button>
			</div>
			<div style={{padding:'10px'}}>
				<input
				type = 'text'
				style={{width:'200px'}}
				onChange = {(e)=>this.setState({idToUpdate:e.target.value})}
				placeholder="put id of item to be updated"
				/>
				<input
				type='text'
				style={{width:'200px'}}
				onChange={(e)=>this.setState({updateToApply:e.target.value})}
				/>
				<button onClick={()=>this.updateDB(this.state.idToUpdate,this.state.updateToApply)}>
					UPDATE
				</button>
			</div>
		</div>
	);
}
}
export default App;