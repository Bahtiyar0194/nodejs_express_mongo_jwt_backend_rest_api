const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config');

module.exports = (req, res, next) => {
    if(req.method === "OPTIONS"){
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message: "Пользователь не авторизован."})
        }
        const verifyToken = jwt.verify(token, JWT_KEY);
        req.user = verifyToken;
        next();
    } catch (e) {
        console.log(e);
        return res.status(401).json({message: "Пользователь не авторизован."})
    }
}