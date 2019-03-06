// ============================
// PORT    
// ============================

process.env.PORT = process.env.PORT || 3000;

// ============================
// ENVIRONMENT
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
// TOKEN EXPIRED DATE
// 60 seconds * 60 minutes * 24 hours * 30 days
// ============================

process.env.EXPIRED_TOKEN = 60 * 60 * 24 * 30;

// ============================
// AUTHENTICATION SEED
// ============================

process.env.AUTHENTICATION_SEED = process.env.NODE_ENV || 'seed-dev';

// ============================
// DATABASE
// ============================
let conexion;

if (process.env.NODE_ENV === 'dev') {
    conexion = 'mongodb://localhost:27017/cafe';
} else {
    conexion = process.env.MONGO_URI;
}

process.env.URLDB = conexion;