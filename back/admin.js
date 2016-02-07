var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var multer = require('multer');
var upload = multer({ dest: './public/img/portofolio/'});

var connection = mysql.createConnection({
	host	: 'localhost',
	user	: 'root',
	password: '',
	database: 'portfolio'
})

/* GET home page. */
router.get('/', function(req, res, next) {
	connection.query('SELECT * FROM projects', function(err, rows, fields) {
	  if(err) throw err;
	  res.render('dashboard', {
	  	"rows" : rows,
	  	layout : 'layout2'
	  });
	});

});

router.get('/new', function(req, res, next){
	res.render('new');
})

router.post('/new', function(req, res, next){
	// Get Form Values
	var title		= req.body.title;
	var description	= req.body.description;
	var service		= req.body.service;
	var client		= req.body.client;
	var projectdate	= req.body.projectdate;
	
	console.log("title: " +req.body.title);




	// Form Field Validation
	req.checkBody('title', 'Title field is required').notEmpty();
	req.checkBody('service', 'Service field is required').notEmpty();

	var errors = req.validationErrors();

	if(errors) {
		res.render('new', {
			errors: errors,
			title: title,
			description: description,
			service: service,
			client: client
		});
	}
	else {
		var project = {
			title: title,
			description: description,
			service: service,
			client: client,
			date: prjectdate
		};

		var query = connection.query('INSERT INTO projects SET ?', project, function(err, result){
			// Project Inserted!
		});

		req.flash('success', 'Project Added');

		res.location('/admin');
		res.redirect('/admin');
	}
});

module.exports = router;
