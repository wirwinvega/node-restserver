const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');

const { verifyToken, verifyAdminRole } = require('../middlewares/auth');

const app = express();

app.get('/usuario', verifyToken, (req, res) => {

    let offset = req.query.offset || 0;
    offset = Number(offset);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ status: true }, 'name email google img role status').skip(offset).limit(limit).exec((err, users) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        User.count({ status: true }, (err, total) => {
            res.json({
                ok: true,
                users,
                total
            });
        });

    });

});

app.post('/usuario', [verifyToken, verifyAdminRole], (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });

    });

});

app.put('/usuario/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    let options = {
        'new': true,
        'runValidators': true
    };

    User.findByIdAndUpdate(id, body, options, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });

    });

});

app.patch('/usuario', [verifyToken, verifyAdminRole], (req, res) => {
    res.json('Patch usuario');
});

app.delete('/usuario/:id', [verifyToken, verifyAdminRole], (req, res) => {

    let id = req.params.id;
    let body = { status: false };

    let options = {
        'new': true,
        'runValidators': true
    };

    User.findByIdAndUpdate(id, body, options, (err, user) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado.'
                }
            });
        }

        return res.json({
            ok: true,
            user
        });

    });

    //Elimina fisicamente el registro
    /*
    User.findByIdAndRemove(id, (err, user) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado.'
                }
            });
        }

        return res.json({
            ok: true,
            user
        });

    });
    */

});

module.exports = app;