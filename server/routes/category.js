const express = require('express');
const bcrypt = require('bcrypt');
const Category = require('../models/category');

const { verifyToken, verifyAdminRole } = require('../middlewares/auth');

let app = express();

//Mostrar todas la categorias
app.get('/category', verifyToken, (req, res) => {

    Category.find({})
        .populate('user', 'name email')
        .sort('description')
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categories
            });

        });

});

//Mostrar categoria por id
app.get('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada.'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });

});

//Crear una nueva categoria.
app.post('/category', verifyToken, (req, res) => {

    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.user._id
    });
    console.log(category);

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });

});

//Actualizar una categoria
app.put('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let categoryToUpdate = {
        description: body.description
    };

    let options = {
        'new': true,
        'runValidators': true
    };

    Category.findByIdAndUpdate(id, categoryToUpdate, options, (err, categoryDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada...'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });

    });

});

//Eliminar una categoria, esto solo puede ser realizado por un usuario con rol de administrador.
app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {

    let id = req.params.id;

    Category.findByIdAndDelete(id, (err, categoryDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada.'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });

    });

});

module.exports = app;