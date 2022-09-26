const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config');

module.exports = (roles) => {
    return (req, res, next) => {
        if (req.method === "OPTIONS") {
            next();
        }

        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Пользователь не авторизован." })
            }

            const { roles: userRoles } = jwt.verify(token, JWT_KEY);
            let hasRole = false;
            userRoles.forEach(role => {
                if(roles.includes(role)){
                    hasRole = true;
                }
            })

            if(!hasRole){
                return res.status(403).json({ message: "Нет доступа." })
            }
            next();
        } catch (e) {
            console.log(e);
            return res.status(401).json({ message: "Ошибка при авторзации." })
        }
    }
}