"use strict";
exports.__esModule = true;
var express_1 = require("express");
var app = (0, express_1["default"])();
var port = process.env.PORT || 3000;
var products = [{ id: 1, title: "tomato" }, { id: 2, title: "orange" }];
var addresses = [{ id: 1, value: "Nezalezhnosti, 13" }, { id: 2, value: "Vorobkevycha, 32" }];
app.get('/', function (req, res) {
    var helloMessage = 'Hello Incubator.EU??';
    res.send(helloMessage);
});
app.get('/products', function (req, res) {
    if (req.query.title) {
        var searchString_1 = req.query.title.toString();
        res.send(products.filter(function (product) { return product.title.includes(searchString_1); }));
    }
    else {
        res.send(products);
    }
});
app.post('/products', function (req, res) {
    var newProduct = { id: +(new Date()), title: req.body.title };
    products.push(newProduct);
    res.status(201).send(newProduct);
});
app.get('/products/:id', function (req, res) {
    var product = products.find(function (product) { return product.id === +req.params.id; });
    if (product) {
        res.send(product);
    }
    else {
        res.send(404);
    }
});
app["delete"]('/products/:id', function (req, res) {
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === +req.params.id) {
            products.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.send(404);
});
app.get('/addresses', function (req, res) {
    res.send(addresses);
});
app.get('/addresses/:id', function (req, res) {
    var address = addresses.find(function (a) { return a.id === +req.params.id; });
    if (address) {
        res.send(address);
    }
    else {
        res.send(404);
    }
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
