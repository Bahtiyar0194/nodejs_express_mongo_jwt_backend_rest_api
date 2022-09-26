const Router = require('express');
const router = new Router();
const controller = require('./controllers/authController');
const { check } = require('express-validator');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');

const minPasswordLength = 6;

router.post('/register', [
    check('email').isEmail().withMessage('Поле должно иметь тип email').notEmpty().withMessage('Поле не может быть пустым'),
    check('password').isLength({ min: minPasswordLength }).withMessage(`Поле должно содержать как минимум ${minPasswordLength} символов`)
], controller.register);

router.post('/login', [
    check('email').notEmpty().withMessage('Поле не может быть пустым'),
    check('password').notEmpty().withMessage('Поле не может быть пустым')
], controller.login);

router.get('/users', roleMiddleware(['admin']), controller.getUsers);

module.exports = router;