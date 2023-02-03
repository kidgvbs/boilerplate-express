/*
Express è un framework per applicazioni web leggero ed è uno dei pacchetti più popolari su npm. Express rende molto più facile creare un server e gestire l'instradamento (routing) per l'applicazione, che gestisce cose come dirigere le persone alla pagina corretta quando visitano un determinato endpoint come /blog.
*/
let express = require('express');
let app = express();
require('dotenv').config(); //permette l'utilizzo di un file .env
// Questo pacchetto consente di utilizzare una serie di middleware, che possono decodificare i dati in diversi formati.
let bodyParser = require('body-parser'); // per analizzare i dati delle richieste POST

/*
app.get('/prova'(ROTTA), function(req, res)(HANDLER) {
  res.send("Hello Express");
});
HANDLER è una funzione che Express chiama quando la rotta corrisponde.
*/

// funzione di default utile ad effettuare i body parser delle richieste POST
// {extended: false} significa che i valori saranno solo stringhe o array
// true è quando viene usata la libreria 'qs' per il parsing 
app.use(bodyParser.urlencoded({extended: false}));

/* MIDDLEWARE Function
Quando una richiesta corrisponde alla rotta, mostrerà la stringa la console Log, dopodiché eseguirà la funzione successiva nello stack. Per montare una funzione middleware a livello di radice, puoi usare il metodo app.use(<mware-function>). In questo caso, la funzione verrà eseguita per tutte le richieste.
è anche possibile impostare condizioni più specifiche. Ad esempio, se desideri che venga eseguita solo per le richieste POST, utilizza app.post(<mware-function>)
*/
app.use((req, res, next) => {
    console.log(req.method + " " + req.path + " - " + req.ip);
    next();
});

let absolutePath = __dirname + "/views/index.html";
// __dirname returns the root directory. Is a best practice for node developers
app.get("/", function(req, res) {
  res.sendFile(absolutePath);
});

// carica il CSS (capire cosa è la funzione express.static)
app.use("/public", express.static(__dirname + "/public"));

let object = {};
// (req, res) => è un metodo più semplice per chiamare una funziona richiesta/risposta
app.get("/json", (req, res) => {
  if (process.env.MESSAGE_STYLE === "uppercase") {
    object = { "message": "Hello json".toUpperCase() };
  } else {
    object = { "message": "Hello json" };
  }
  res.json(object);
});

/*
Questo approccio è utile per dividere le operazioni server in unità più piccole. Questo porta a una migliore struttura delle app, e alla possibilità di riutilizzare il codice in luoghi diversi. 
Questo approccio può essere utilizzato anche per eseguire una convalida sui dati. In ogni punto dello stack middleware è possibile bloccare l'esecuzione della catena corrente e passare il controllo a funzioni specificamente progettate per gestire gli errori. 
Oppure è possibile passare il controllo alla prossima rotta corrispondente, per gestire casi speciali.
*/
app.get("/now", (req, res, next) => {
  req.time = new Date().toString();
  next();
  }, (req, res) => {
    res.json({time: req.time});
});

// :word sarà una qualsiasi parola richiesta nella URL
// es. https://example.com/prova/echo
app.get("/:word/echo", (req, res) =>{
  res.json({echo: req.params.word});
});

// la req sarà uguale a https://URI/name?first=Nome&last=Cognome
app.get("/name", (req, res) => {
  res.json({name: req.query.first + " " + req.query.last });
});

/*
puoi usare il metodo app.route(path).get(handler).post(handler).
Questa sintassi consente di concatenare diversi gestori di verbi sullo stesso percorso.
*/
// Gestire le richieste in POST
app.post("/name", (req, res) => {
  res.json({name: req.body.first + " " + req.body.last}); 
  // first e last sono i nomi degli input di testo nell'HTML
});

module.exports = app;
