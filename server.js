
const express = require('express');
const nodemailer = require('nodemailer');
const app= express();
const session = require('express-session');
const passport = require('passport');
require('./public/js/auth');
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.sendFile('autenticazione.html', { root: './public' })
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: 'http://localhost:5000/paginainiziale.html',
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Buongiorno ${req.user.displayName}`);
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Logout effettuato');
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Autenticazione fallita');
});

app.listen(5000, () => console.log('in ascolto su porta 5000'));




//invio di email di assistenza da parte dell'utente, compilando il form



const PORT =process.env.PORT || 2525;

app.use(express.static('public'));
app.use(express.json())

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/public/paginainiziale.html')
})

app.post('/', (req, res)=>{
    console.log(req.body);
    const transporter = nodemailer.createTransport({        //autenticazione al servizio mail
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "949b0d30a196ba",
            pass: "66fb874925b2a6"
        }
      });
      //opzioni email da inviare
      const mailOptions = {
        to: "francescoavant2000@gmail.com",
        from: req.body.email,       //nelle opzioni della mail richiamo ciò che l'utente ha inserito in input
        
        subject: `Messaggio da ${req.body.email}: ${req.body.subject}`, //nell'oggetto della mail inserisco i dati in input forniti dall'utente
        text: req.body.message
    }

    //invio della email
    transporter.sendMail(mailOptions, (error, info)=>{
        if (error){
            console.log(error);
            res.send('error');
        }else{
            console.log('Email inviata: '+ info.response);          //stampo nel log l'invio andato a buon fine con il response
            res.send('successo');
        }
    });
});


app.listen(PORT, ()=>{
    console.log(`Server ok`)
})





//salvataggio dati ingresso in MongoDB
var bodyParser=require("body-parser");
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mydb');                 //richiamo url di connessione con db
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
	console.log("connessione ok");                                  //se la connessione va a buon fine
})

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));

app.post('/ingresso.html', function(req,res){
	var name = req.body.name;
	var cognome =req.body.cognome;
	var phone =req.body.phone;
    var date =req.body.date;
    var ora =req.body.ora;
    var motivazione = req.body.motivazione
    
	var data = {                                    //definisco la strutture dello schema 
		"name": name,
		"cognome":cognome,
		"phone":phone,
    "date": date,
    "ora":ora,
    "motivazione": motivazione
	}
db.collection('details').insertOne(data,function(err, collection){              //se inserimento andato a buon fine
		if (err) throw err;
		console.log("Inserimento dati avvenuto con successo");
			
	});
	return res.redirect('inserito.html');

})


app.get('/',function(req,res){                              //imposto l'accesso al db
res.set({
	'Access-control-Allow-Origin': '*'
	});
return res.redirect('inserito.html');
}).listen(27017)                                        //in ascolto su porta 27017


console.log("Server ok");

// query mongodb per mostrare in output gli ingressi odierni
var MongoClient = require('mongodb').MongoClient;
const { WriteConcern } = require('mongoose/node_modules/mongodb');
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  const d = new Date();
  d.setDate(d.getDate());
  var dbo = db.db("mydb");
  var query = { date: '2022'+'-'+(d.getMonth()+1).toString().slice(-2)+'-'+'0'+ d.getDate().toString().slice(-2)}; 
  //getMonth mi restituisce i valori dei mesi da 0 a 11, dunque necessito l'aggiunta di 1 per visualizzare la data normalmente
  //slice consente di gestire i giorni con 01...09, in quanto nel db gli stessi sono memorizzati con lo 0

  dbo.collection("details").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log('Gli ingressi di oggi:')
    console.log(result)
  
    dbo.collection("details").count(function(err, res){           //restituisce il totale degli elementi nel db
      if (err) throw err;
      console.log('Il numero di ingressi totali è '+res);


//invio automatico di email riepilogo all'ammministratore di sistema

let cron = require('node-cron');                    //nodecron mi consente di creare uno schedule e dunque programmare l'invio di mail

  // opzioni email da inviare
  let mailOptions = {
        from: '9f08cf05fa45ac',
        to: 'francescoavant2000@gmail.com',
        subject: 'Riepilogo giornaliero',
        text: 'il numero di ingressi totali è:' + res +'\n'+'I dettagli degli ingressi di oggi sono:' + result
   };

  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "9f08cf05fa45ac",
        pass: "e06853d1e9bbeb"
    }
    });
 
 cron.schedule('0 4 * * *', () => {                            //l'invio viene programmato per ogni giorno alle 16:00 0 4 * * * 
  // invio della email
  transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email inviata: ' + info.response);
        }
    });
  },{
      scheduled: true,                                          //valore booleano per controllo della programmazione dell'invio
      timezone: 'Europe/Rome'                                   //la timezone impostata è quella italiana
  });
 })  
})})









