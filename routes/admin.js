var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var path = require('path');
var multer = require('multer');

// var storage = multer.diskStorage({
// 	destination: function(req, file, cb) {
// 		cb(null, '/tmp/my-uploads');
// 	},
// 	filename: function(req, file, cb) {
// 		cb(null, file.fieldname + '-' + Date.now());
// 	}
// });

// ORIGINAL FROM this works. can change filename
// http://stackoverflow.com/questions/32184589/renaming-an-uploaded-file-using-multer-doesnt-work-express-js

// var options = multer.diskStorage({ destination : 'uploads/' ,
//   filename: function (req, file, cb) {
//   	console.log(file);
//     cb(null, (Math.random().toString(36)+'00000000000000000').slice(2, 10) + Date.now() + path.extname(file.originalname));
//   }
// });

// sama kayak nama asli file yg di upload
var options = multer.diskStorage({ destination : 'public/img' ,
  filename: function (req, file, cb) {
  	console.log(file);
    cb(null, file.originalname);
  }
});

// var upload = multer({storage: storage});

var upload= multer({ storage: options });



var connection = mysql.createConnection({
	host 	: 'localhost',
	user 	: 'root',
	password: '',
	database: 'portfolio'
});

connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
	connection.query('SELECT * FROM projects', function(err, rows, fields){
		if(err) throw err;
		res.render('dashboard', { 
			"rows": rows,
			layout: "layout2"
		});
	});	
});

router.get('/new', function(req, res, next) {
	res.render('new');
})



router.post('/new', upload.single('projectimage'), function(req, res, next){

// router.post('/new', upload.fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 }]), function(req, res, next){	
	// get form values
	var title 		= req.body.title;
	var description = req.body.description;
	var service 	= req.body.service;
	var client 		= req.body.client;
	var projectdate	= req.body.projectdate;


	// Check Image
	if(req.file) {
		// file info		
		var projectImageName 			= req.file.originalname;
		var projectImageMime 			= req.file.mimetype;
		var projectImagePath 			= req.file.path;
		var projectImageSize 			= req.file.size;
	}
	else {
		var projectImageName = 'noimage.jpg';
	}

	// Form Field Validation
	req.checkBody('title', 'Title field is required').notEmpty();
	req.checkBody('service', 'Service field is required').notEmpty();

	var errors = req.validationErrors();

	if(errors) {
		res.render('new', {
			error: errors,
			title: title,
			description: description,
			service: service,
			client: client
		});
	} else {
		var project = {
			title: title,
			description: description,
			service: service,
			client: client,
			date: projectdate,
			image: projectImageName
		};

		var query = connection.query('INSERT INTO projects SET ?', project, function(err, result){
			// Projet Inserted!
		});

		req.flash('success', 'Project Added');

		res.location('/admin');
		res.redirect('/admin');
	}

});

module.exports = router;
