const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { JWT_KEY } = require('../config');

const generateAccessToken = (id, roles) => {
    const payload = {
        id, roles
    }
    return jwt.sign(payload, JWT_KEY, { expiresIn: "24h" })
}

class authController {
    async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Ошибка при регистрации", errors })
            }
            const { email, password } = req.body;
            const userFound = await User.findOne({ email });
            if (userFound) {
                return res.status(400).json({ message: "Пользователь с таким email уже зарегистрирован." })
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: 'user' });
            const newUser = new User({
                email: email,
                password: hashPassword,
                roles: [userRole.value]
            });

            await newUser.save();
            return res.status(200).json({ message: 'Пользователь успешно зарегистрирован.' });

        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: 'Ошибка регистрации.' })
        }
    }

    async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Ошибка при авторизации.", errors })
            }

            const { email, password } = req.body;
            const findUser = await User.findOne({ email });

            

            if (findUser) {
                const validPassword = bcrypt.compareSync(password, findUser.password);
                if(!validPassword){
                    return res.status(400).json({ message: 'Неправильный email или пароль.' });
                }
                const token = generateAccessToken(findUser._id, findUser.roles)
                return res.status(200).json({ token: token });
            }
            else{
                return res.status(400).json({ message: 'Неправильный email или пароль.' });
            }
        }
        catch (e) {
            console.log(e);
            return res.status(400).json({ message: 'Ошибка при авторизации.' })
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();
            return res.status(200).json(users);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new authController()