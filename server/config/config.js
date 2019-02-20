process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let conexion;

if (process.env.NODE_ENV === 'dev') {
    conexion = 'mongodb+srv://irving:Bkl7tLKyuS52gv6N@cluster0-7lwyq.mongodb.net/test?retryWrites=true';
} else {
    conexion = 'mongodb+srv://irving:Bkl7tLKyuS52gv6N@cluster0-7lwyq.mongodb.net/test?retryWrites=true';
}

process.env.URLDB = conexion;