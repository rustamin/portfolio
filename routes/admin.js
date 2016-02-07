var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var multer = require('multer');

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

router.post('/new', multer({dest: './uploads'}).single('projectimage'), function(req, res, next){
	// get form values
	var title 		= req.body.title;
	var description = req.body.description;
	var service 	= req.body.service;
	var client 		= req.body.client;
	var projectdate	= req.body.projectdate;

	console.log(req.file);

	// Check Image
	if(req.file) {
		console.log("req.file is true");
		// file info
		var projectImageName 			= req.file.originalname;
		var projectImageMime 			= req.file.mimetype;
		var projectImagePath 			= req.file.path;
		var projectImageSize 			= req.file.size;
	}
	else {
		var projectImageName = 'noimage.jpg';
	}

	console.log("title: " + title);
	console.log("img: " + projectImageName);

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
