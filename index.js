const express = require('express');
const cors = require("cors")
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', function(req, res){res.send('Hello world')});

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const endpoint = "/products";

app.get(endpoint, function(req, res){
    res.send(products.filter(Boolean));
});

app.get(`${endpoint}/:id`, function(req, res){
    const id = req.params.id;
    const product = products[id];

    if (!product){
        res.send("{}");
    } else {
        res.send(product);
    }  
});

// Insert
app.post(endpoint, (req, res) => {
    const product = {
        id : parseInt(req.params.id),
        name : req.body["name"],
        quantity : req.body["quantity"], 
        type : req.body["type"], 
        dateBuy: req.body["dateBuy"],
        expirationDate: req.body["expirationDate"]
    };
    console.log("INDEX.JS - POST");
    products.push(product);
    res.send(product.name + product.quantity + product.type + product.dateBuy + product.expirationDate);

    notify();
});

// Atualização
app.put(`${endpoint}/:id`, (req, res) =>{
    const id = parseInt(req.params.id);
    const product = {
        id : id,
        name : req.body["name"],
        quantity : req.body["quantity"], 
        type : req.body["type"], 
        dateBuy: req.body["dateBuy"],
        expirationDate: req.body["expirationDate"]
    };

    products[id] = product;
    res.send("1");

    notify();
});

app.delete(`${endpoint}/:id`, (req, res) => {
    const id = req.params.id;
    delete products[id];
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

/* Servidor */

const products = [
    {id: 0, name: "Pinça", type: "Utensílio", quantity: 10, dateBuy : "2021-06-21", expirationDate : "-"},
    {id: 1, name: "Henna", type: "Material", quantity: 10, dateBuy : "2021-06-21", expirationDate : "-"},
    {id: 1, name: "Algodao", type: "Descartável", quantity: 100, dateBuy : "2021-06-21", expirationDate : "-"},
]