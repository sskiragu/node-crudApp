const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Book = require('./Book.model');
const methodOverride = require('method-override');
const db = "mongodb://localhost:27017/example";

 // npm run watch

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
	Book.findOne({
		_id:req.params.id
	})
	.exec((err,book)=>{
		if (err) {
			res.send('Error has occured');
		}else{
			res.render('edit', {id:req.params.id, title:book.title, author:book.author, category:book.category});
			// res.json(book);
			// res.render('search',{'booksList':book});

		}
	});
});

//retrieving multiple books
app.get('/books', (req, res)=>{
	console.log('Getting all books');
	Book.find({})
	.exec((err,books)=>{
		if (err) {
			res.send('Error has occured');
		}else{
			// res.send(books);
			res.render('books',{'booksList':books});
		}
	});
});

//retrieving one book
app.get('/books/:id', (req, res)=>{
	console.log('Getting one book');
	Book.findOne({
		_id:req.params.id
	})
	.exec((err,book)=>{
		if (err) {
			res.send('Error has occured');
		}else{
			// res.render('books', {title: book.title, author: book.author, category: book.category});
			// res.json(book);
			res.render('search',{'booksList':book});

		}
	});
});

//add book
app.post('/book', (req, res)=>{
	let newBook = new Book();

	newBook.title = req.body.title;
	newBook.author = req.body.author;
	newBook.category = req.body.category;
	newBook.save((err, book)=>{
		if (err) {
			res.send('Error saving book');
		}else{
			res.redirect('/');
		}
	});
});

//add book alternative method
app.post('/book2', (req, res)=>{
	Book.create(req.body, (err, book)=>{
		if (err) {
			res.send('Error saving your data');
			console.log('Error '+err);
		}else{
			res.send(book);
		}
	});
});

//update
app.put('/book/:id', (req, res)=>{
	Book.findOneAndUpdate({
		_id:req.params.id
	}, {$set: {title: req.body.title, author: req.body.author}, category: req.body.category},{upsert: true},(err, newBook)=>{
		if (err) {
			console.log('Error '+ err);
		}else{
			console.log(newBook);
			res.sendStatus(204);
		}
	});
});
//delete
app.delete('/book/:id', (req, res)=>{
	Book.findOneAndRemove({
		_id:req.params.id
	},(err, book)=>{
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