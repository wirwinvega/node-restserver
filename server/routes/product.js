const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const Product = require('../models/product');
const Category = require('../models/category');
const app = express();


//Obtener todos los productos, con populate y paginados
app.get('/products', verifyToken, (req, res) => {

    let offset = req.query.offset || 0;
    offset = Number(offset);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    Product.find({})
        .limit(limit)
        .skip(offset)
        .populate(['category', 'user'])
        .exec((err, productsDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Product.count({ available: true }, (err, total) => {
                res.json({
                    ok: true,
                    products: productsDB,
                    total: total
                });
            })

        });

});

//Obtener un producto mediante su id y populado.
app.get('/products/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Product.findById(id)
        .populate(['category', 'user'])
        .exec((err, productDB) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productDB) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no fue encontrado.'
                    }
                });
            }

            res.json({
                ok: true,
                product: productDB
            });

        });

});

//Crear un producto
app.post('/products', verifyToken, (req, res) => {

    let user = req.user._id;
    let body = req.body;

    Category.findById(body.categoryId, (err, categoryDB) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria no se encontro.'
                }
            });
        }

        let product = new Product({
            name: body.name,
            priceUnitary: body.priceUnitary,
            description: body.description,
            category: categoryDB._id,
            user: user,
        });

        product.save((err, productDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(201).json({
                ok: true,
                product: productDB
            });

        });

    });

});

//Buscar un producto
app.get('/products/search/:term', verifyToken, (req, res) => {

    let term = req.params.term;
    console.log(term);
    if (!term) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El término es requerido.'
            }
        });
    }
    let regex = new RegExp(term, 'i');

    Product.find({ name: regex })
        .populate(['category', 'user'])
        .exec((err, productsDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products: productsDB
            });

        });

});

//Actualizar un producto
app.put('/products/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let user = req.user._id;
    let body = req.body;
    Category.findById(body.categoryId, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria no se encontro.'
                }
            });
        }

        let productToUpdate = {
            name: body.name,
            priceUnitary: body.priceUnitary,
            description: body.description,
            available: body.available,
            category: categoryDB._id,
            user: user,
        };

        Product.findByIdAndUpdate(id, productToUpdate, (err, productDB) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productDB) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no fue encontrado.'
                    }
                });
            }

            res.json({
                ok: true,
                product: productDB
            });

        });

    });

});

//Eliminar un producto (borrado lógico, usando el campo available).
app.delete('/products/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    let productToUpdate = {
        available: false
    };

    Product.findByIdAndUpdate(id, productToUpdate, (err, productDB) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no fue encontrado.'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Producto borrado correctamente',
            product: productDB
        });

    });

});

module.exports = app;