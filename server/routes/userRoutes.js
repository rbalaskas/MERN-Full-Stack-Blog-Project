const { Router } = require('express');
const { registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors, verifyEmail, getTopContributors } = require("../controllers/userControllers");
const authMiddleware = require('../middleware/authMiddleware');
const router = Router();

router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.get('/', getAuthors);
router.post('/change-avatar', authMiddleware, changeAvatar);
router.patch('/edit-user', authMiddleware, editUser);
router.get('/top-contributors', getTopContributors);
router.post('/login', loginUser);
router.get('/:id', getUser);


module.exports = router;
