const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyparser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

//this is our Mongo DB database
const dbRoute = 'mongodb+srv://Atlas_admin:AtlasDb@123@cluster0-pqgmb.mongodb.net/test';

mongoose.connect(dbRoute,{ useNewUrlParser: true });

let db = mongoose.connection;

db.once('open',()=> console.log('connected to the database'));

//check if the connection is successfull
db.on('error',console.error.bind(console,'MongoDB connection error'));

//(optional) only made for logging and 
// bodyparser, parses the request body to be readable json format
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(logger('dev'));

//this our get method
//this method fetchs all available data in our database
router.get('/getData',	(req,res)=>{
	Data.find((err,data)=>{
		if(err) return res.json({success:false,error:err});
		return res.json({success:true, data:data});
	});
});

//this is our update method
router.post('/updatedata',(req,res)=>{
	const{id,update} = req.body;
	Data.findByIdAndUpdate(id,update,(err)=>{
	if(err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

//this is our delete method
router.delete('/deleteData',(req,res)=>{
	const { id } = req.body;
	Data.findByIdAndRemove(id,(err) => {
		if(err) return res.send(err);
		return res.json({success:true});
	});
});

//this is our create method
router.post('/putData',(req,res)=>{
	let data = new Data();
	
	const { id,message} = req.body;
	if((!id && id!==0) || !message){
		return res.json({
			success: false,
			error: 'INVALID INPUTS',
		});
	}
	data.message = message;
	data.id = id;
	data.save((err)=>{
		if (err) return res.json({success:false, error:err});
		return res.json({success:true});
	});
});

//append /api for http request
app.use('/api', router);

//launch our backend into a port
app.listen(API_PORT,()=>console.log(`LISTENING ON PORT ${API_PORT}`));
			