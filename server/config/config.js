process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let conexion;

if (process.env.NODE_ENV === 'dev') {
    conexion = 'mongodb://localhost:27017/cafe';
} else {
    conexion = process.env.MONGO_URI;
}

process.env.URLDB = conexion;