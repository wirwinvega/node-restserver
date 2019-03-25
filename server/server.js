require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '../public')));

// Configuración de rutas
app.use(require('../server/routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Conectado a mongoose success');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto: ${process.env.PORT}`);
});