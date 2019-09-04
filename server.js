var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
// var fileUpload = require('express-fileupload');
var Event = require('./event-model');
var Category = require('./category-model');



//setup database connection
var connectionString = 'mongodb://event:event12345@cluster0-shard-00-00-evan5.mongodb.net:27017,cluster0-shard-00-01-evan5.mongodb.net:27017,cluster0-shard-00-02-evan5.mongodb.net:27017/event?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(connectionString,{ useNewUrlParser: true });
var  db = mongoose.connection;
db.once('open', () => console.log('Database connected'));
db.on('error', () => console.log('Database error'));

//setup express server
var app = express();
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(logger('dev'));

app.use(express.static('public'))

var router = express.Router();

router.get('/categories', (req, res) => {
    Category.find()
    .then((categories)=>{
        return res.json(categories);
    });
})

router.get('/testing', (req, res) => {
    res.send('<h1>Testing is working</h1>')
  })

router.get('/events', (req, res) => {
    Event.find()
    .then((events)=>{
        return res.json(events);
    });
})
router.get('/events/:id', (req, res) => {

	Event.findOne({id:req.params.id})
	.then((event) => {
	    return res.json(event);
	});
})

router.post('/events', (req, res) => {

	var event = new Event();
	event.id = Date.now();
	
	var data = req.body; 
	Object.assign(project,data); 
	
	event.save()
	.then((event) => {
	  	return res.json(event);
	});
});

router.post('/upload', (req, res) => {

	var files = Object.values(req.files); 
    var uploadedFile = files[0]; 
    
	var newName = Date.now() + uploadedFile.name;

	uploadedFile.mv('public/' + newName,function (){
		res.send(newName);
	})

});

router.delete('/events/:id', (req, res) => {

	Event.deleteOne({ id: req.params.id })
	.then(() => {
		return res.json('deleted');
	});
});

router.put('/events/:id', (req, res) => {

	Event.findOne({id:req.params.id})
	.then((event) => {
		var data = req.body;
		Object.assign(event,data);
		return event.save()	
	})
	.then((event) => {
		return res.json(event);
	});	

});




app.use('/api', router);


// launch our backend into a port
const apiPort = 4000;
app.listen(apiPort, () => console.log('Listening on port '+apiPort));


