const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Student = require('./Student.model');
const methodOverride = require('method-override');
const db = "mongodb://localhost:27017/example";

 // npm run watch

 app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
	if (err) {
		console.log("erro" + err);
	}
	else{
		console.log("Connected");
	}
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));
//testing
app.use( function( req, res, next ) {
    // this middleware will call for each requested
    // and we checked for the requested query properties
    // if _method was existed
    // then we know, clients need to call DELETE request instead
    if ( req.query._method == 'DELETE' ) {
        // change the original METHOD
        // into DELETE method
        req.method = 'DELETE';
        // and set requested url to /user/12
        req.url = req.path;
    }       
    next(); 
});

app.get('/', (req,res)=>{
	res.sendFile(__dirname + '/' + 'index.html');
});

app.get('/dashboard', (req,res)=>{
	res.sendFile(__dirname + '/' + 'dashboard.html');
});

app.get('/register', (req,res)=>{
	res.sendFile(__dirname + '/' + 'register.html');
});

app.get('/editForm/:id', (req,res)=>{
	Student.findOne({
		_id:req.params.id
	})
	.exec((err,student)=>{
		if (err) {
			res.send('Error has occured');
		}else{
			res.render('edit', {id:req.params.id, title:student.title, author:student.author, category:student.category});
			// res.json(student);
			// res.render('search',{'studentsList':student});

		}
	});
});

//retrieving multiple students
app.get('/students', (req, res)=>{
	console.log('Getting all students');
	Student.find({})
	.exec((err,students)=>{
		if (err) {
			res.send('Error has occured');
		}else{
			// res.send(students);
			res.render('students',{'studentsList':students});
		}
	});
});

//retrieving one student
app.get('/students/:id', (req, res)=>{
	console.log('Getting one student');
	Student.findOne({
		_id:req.params.id
	})
	.exec((err,student)=>{
		if (err) {
			res.send('Error has occured');
		}else{
			// res.render('students', {title: student.title, author: student.author, category: student.category});
			// res.json(student);
			res.render('search',{'studentsList':student});

		}
	});
});

//add student
app.post('/student', (req, res)=>{
	let newStudent = new Student();

	newStudent.first_name = req.body.first_name;
	newStudent.last_name = req.body.last_name;
	newStudent.email = req.body.email;
	newStudent.password = req.body.password;
	newStudent.phone = req.body.phone;
	newStudent.news_letter = req.body.news_letter;
	newStudent.save((err, student)=>{
		if (err) {
			res.send('Error saving student');
		}else{
			res.redirect('/');
		}
	});
});

//add student alternative method
app.post('/student2', (req, res)=>{
	Student.create(req.body, (err, student)=>{
		if (err) {
			res.send('Error saving your data');
			console.log('Error '+err);
		}else{
			res.send(student);
		}
	});
});

//update
app.put('/student/:id', (req, res)=>{
	Student.findOneAndUpdate({
		_id:req.params.id
	}, {$set: {first_name: req.body.first_name, last_name: req.body.last_name}, email: req.body.email, password: req.body.password,phone: req.body.phone,news_letter: req.body.news_letter},{upsert: true},(err, newStudent)=>{
		if (err) {
			console.log('Error '+ err);
		}else{
			console.log(newStudent);
			res.sendStatus(204);
		}
	});
});
//delete
app.delete('/student/:id', (req, res)=>{
	Student.findOneAndRemove({
		_id:req.params.id
	},(err, student)=>{
		if (err) {
			console.log('Error' + err);
		}else{
			res.sendStatus(204);
		}
	});
});


const port = 5000;

app.listen(port, ()=>{
	console.log("Server is running on port " + port);
});