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

// ============================
// Google CLIENT_ID
// ============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '210184949694-t593smidh8djlk3b6qv5tva7pi0mddl2.apps.googleusercontent.com';