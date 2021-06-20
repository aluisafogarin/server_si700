const express = require('express');
const cors = require("cors")
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', function(req, res){res.send('Hello world')});

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const endpointProducts = "/products";
const endpointCashier = "/cashier";

/* Servidor */
const products = [];
 const cashier = [];

app.get(endpointProducts, function(req, res){
    res.send(products.filter(Boolean));
});

app.get(endpointCashier, function(req, res) {
    res.send(cashier.filter(Boolean));
});

// Get
app.get(`${endpointProducts}/:id`, function(req, res){
    const id = req.params.id;
    const product = products[id];

    if (!product){
        res.send("{}");
    } else {
        res.send(product);
    }  
});

app.get(`${endpointCashier}/:id`, function(req, res) {
    const id = req.params.id;
    const cash = cashier[id];

    if (!cash) {
        res.send("{}");
    } else {
        res.send(cash);
    }
});

// Insert
app.post(endpointProducts, (req, res) => {
    const product = {
        id: products.length,
        name : req.body["name"],
        quantity : req.body["quantity"], 
        type : req.body["type"], 
        buyDate: req.body["buyDate"],
        expirationDate: req.body["expirationDate"],
        cash : req.body["cash"]
    };

    products.push(product);
    res.send("1");

    notify();
});

app.post(endpointCashier, (req, res) => {
    console.log(cashier.length);
    const cash = {
        id : cashier.length,
        value : req.body["value"],
        description : req.body["description"],
        date : req.body["date"]
    };

    cashier.push(cash);
    res.send("1");

    notify();
}); 


// Atualização
app.put(`${endpointProducts}/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const product = {
        id : id,
        name : req.body["name"],
        quantity : req.body["quantity"], 
        type : req.body["type"], 
        buyDate: req.body["buyDate"],
        expirationDate: req.body["expirationDate"],
        cash : req.body["cash"]
    };

    products[id] = product;
    res.send("1");

    notify();
});

app.put(`${endpointCashier}/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const cash = {
        id : id,
        value : req.body["value"],
        description : req.body["description"],
        date : req.body["date"]
    }

    cashier[id] = cash;
    res.send("1");

    notify();
}); 

app.delete(`${endpointProducts}/:id`, (req, res) => {
    const id = req.params.id;
    delete products[id];
    res.send("1");

    notify();
});

app.delete(`${endpointCashier}/:id`, (req, res) => {
    const id = req.params.id;
    delete cashier[id];
    res.send("1");

    notify();
}); 

/*
  Criar um socket para notificar usuários das mudanças.
*/
// Comunicação
const INVALIDATE = 'invalidate';

function notify() {
    io.sockets.emit(INVALIDATE, 1);
}

server.listen(process.env.PORT || 3000); 


/* 
const products = [
    {id: 0, name: "Pinça", type: "Utensílio", quantity: 10, buyDate : "2021-06-21", expirationDate : "-"},
    {id: 1, name: "Henna", type: "Material", quantity: 10, buyDate : "2021-06-21", expirationDate : "-"},
    {id: 1, name: "Algodao", type: "Descartável", quantity: 100, buyDate : "2021-06-21", expirationDate : "-"},
] */