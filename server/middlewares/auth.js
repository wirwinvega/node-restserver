const jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.AUTHENTICATION_SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decoded.user;
        next();
    });

};

let verifyAdminRole = (req, res, next) => {

    let user = req.user;

    if (user.role !== 'ADMIN_ROLE') {
        return res.status(400).json({
            ok: false,
            err: 'Necesitas un usuario con permisos de administrador.'
        });
    }

    next();

};

module.exports = {
    verifyToken,
    verifyAdminRole
}