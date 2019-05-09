const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const uniqid = require('uniqid');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const Product = require('../models/product');

// default options
app.use(fileUpload());

app.put('/upload/:type/:id', (req, res) => {

            let type = req.params.type;
            let id = req.params.id;

            if (Object.keys(req.files).length == 0) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No ha seleccionado archivos para subir.'
                    }
                });
            }

            //Validate types
            let validTypes = ['products', 'users'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `Los tipos permitidos son ${validTypes.join(", ")}`,
                        type
                    }
                });
            }

            let dataFile = req.files.dataFile;
            let splitName = dataFile.name.split('.');
            let extension = splitName[splitName.length - 1];
            let extensionsValid = ['png', 'jpg', 'jpeg', 'gif'];

            if (!extensionsValid.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `Las extensiones permitidas son ${extensionsValid.join(", ")}`,
                        ext: extension
                    }
                });
            }

            //Change file name
            let fileName = `${uniqid(`${id}-`)}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    dataFile.mv(`uploads/${type}/${fileName}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

            switch(type) {
                case 'products':
                    saveProductImgDB(id, res, fileName, type);
                break;
                case 'users':
                    saveUserImgDB(id, res, fileName, type);
                break;
                default:
                deleteFile(type, fileName);
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'La opción seleccionada es incorrecta.'
                    }
                });
            }            
        
    });
});

function saveUserImgDB(id, res, fileName, type) {

    User.findById(id, (err, userDB) => {

        if(err) {
            deleteFile(type, fileName);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!userDB) {
            deleteFile(type, fileName);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id de usuario es incorrecto.'
                }
            });
        }

        deleteFile(type, userDB.img);

        userDB.img = fileName;
        userDB.save((err, userBD) => {
            
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                user: userBD
            });

        });

    });

}

function saveProductImgDB(id, res, fileName, type) {
    Product.findById(id, (err, productDB) => {

        if(err) {
            deleteFile(type, fileName);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productDB) {
            deleteFile(type, fileName);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id de producto es incorrecto.'
                }
            });
        }

        deleteFile(type, productDB.img);

        productDB.img = fileName;
        productDB.save((err, productDB) => {
            
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                product: productDB
            });

        });

    });
}

function deleteFile(type, fileName) {

    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);
    if(fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }

}

module.exports = app;