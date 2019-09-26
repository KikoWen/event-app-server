var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var fileUpload = require('express-fileupload');
var Event = require('./event-model');
var Category = require('./category-model');
var User = require('./user-model');
var Review = require('./review-model');



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
app.use(fileUpload());
app.use(logger('dev'));

app.use(express.static('public'))

var router = express.Router();

// Category Router: get category
router.get('/categories', (req, res) => {
    Category.find()
    .then((categories)=>{
		return res.json(categories);
		
    });
})


router.get('/categories/:id', (req, res) => {

	Category.findOne({id:req.params.id})
	.populate({
		path:'events',
		populate: 'category'
	})
	.then((category) => {
	    return res.json(category);
	});
})

//Event Router: get events, get event by id, update (put) event, create (post) event

router.get('/events', (req, res) => {
	Event.find()
	.populate('category')
    .then((events)=>{
        return res.json(events);
    });
})


router.get('/events/:id', (req, res) => {

	Event.findOne({id:req.params.id})
	.populate({
		path:'reviews',
		populate:'user'
	})
	.then((event) => {
		console.log(event)
	    return res.json(event);
	});
})

router.post('/events', (req, res) => {

	var event = new Event();
	event.id = Date.now();
	
	var data = req.body; 
	Object.assign(event,data); 
	
	event.save()
	.then((event) => {
	  	return res.json(event);
	});
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

//User router: get, get by id, delete id, create(post) user, update(put) user

router.get('/users', (req, res) => {
    User.find()
    .then((users)=>{
        return res.json(users);
    });
})

router.get('/users/:id', (req, res) => {

	User.findOne({id:req.params.id})
	.populate('bookmarks')
	.then((user) => {
	    return res.json(user);
	});
})

router.delete('/users/:id', (req, res) => {

	User.deleteOne({ id: req.params.id })
	.then(() => {
		return res.json('deleted');
	});
});

router.post('/users', (req, res) => {

	var user = new User();
	user.id = Date.now();
	
	var data = req.body; 
	Object.assign(user,data); 
	
	user.save()
	.then((user) => {
	  	return res.json(user);
	});
});

router.post('/users/:id/saved-events', (req, res) => {

	var data = req.body
	var eventId = data.eventid	
	User.findOne({id:req.params.id})
	.then((user) => {
		user.savedEvents.push(eventId)
		user.save()
		
		.then((user) => {
			
			User.findOne({id:req.params.id})
			.populate('bookmarks')
			.then((user) => {
				return res.json(user);
			})
		})
	})
})

router.delete('/users/:id/saved-events/:eventid', (req, res) => {


	console.log('hi')
})

router.put('/users/:id', (req, res) => {

	User.findOne({id:req.params.id})
	.then((user) => {
		var data = req.body;
		Object.assign(user,data);
		return user.save()	
	})
	.then((user) => {
		return res.json(user);
	});	

});

// Router comment section


router.post('/reviews', (req, res) => {

	var review = new Review();
	review.id = Date.now();
	
	var data = req.body;
	Object.assign(review,data);
	
	review.save()
	.then((review) => {
	  	return res.json(review);
	});
});

router.delete('/reviews/:id', (req, res) => {

	Review.deleteOne({ id: req.params.id })
	.then(() => {
		return res.json('deleted');
	});
});


// Upload Photo Router

router.post('/upload', (req, res) => {

	if(req.files){
		var files = Object.values(req.files); 
		var uploadedFile = files[0]; 
		
		var newName = Date.now() + uploadedFile.name;
	
		uploadedFile.mv('public/' + newName,function (){
			res.send(newName);
		})
	}else{
		res.send('');

	}


});

// Login features

router.post('/authenticate', (req, res) => {

	console.log('Hi');
	var {username,password} = req.body;
	var credential = {username,password}
	User.findOne(credential)
	.then((user) => {
	    return res.json(user);
	});
})





app.use('/api', router);


// launch our backend into a port
const apiPort = 4000;
app.listen(apiPort, () => console.log('Listening on port '+apiPort));


