var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var path = require('path');
var multer = require('multer');


// source
// http://stackoverflow.com/questions/32184589/renaming-an-uploaded-file-using-multer-doesnt-work-express-js

// filename == original filename
var options = multer.diskStorage({ destination : 'public/img' ,
  filename: function (req, file, cb) {
  	console.log(file);
    cb(null, file.originalname);
  }
});

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

/* GET New Project. */
router.get('/new', function(req, res, next) {
	res.render('new');
})


/* POST New Project. */
router.post('/new', upload.single('projectimage'), function(req, res, next){
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

/* GET Edit Page. */
router.get('/edit/:id', function(req, res, next) {
	connection.query('SELECT * FROM projects WHERE id = '+ req.params.id, function(err, row, fields){
		if(err) throw err;
		res.render('edit', { 
			"row": row[0],
			layout: "layout2"
		});
	});	
});

/* POST Edit Project. */
router.post('/edit/:id', upload.single('projectimage'), function(req, res, next){
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

		var query = connection.query('UPDATE projects SET ? WHERE id = ' + req.params.id, project, function(err, result){
			// Projet Inserted!
		});

		req.flash('success', 'Project Edited');

		res.location('/admin');
		res.redirect('/admin');
	}
});

router.delete('/delete/:id', function(req, res){
	connection.query('DELETE FROM projects WHERE id = ' + req.params.id, function(err, result){
		if(err) throw err;
	});
	req.flash('success', 'Project Deleted');

	res.location('/admin');
	res.redirect('/admin');
})

module.exports = router;
