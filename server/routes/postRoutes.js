const { Router } = require('express');
const { createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost, getPopularPosts } = require('../controllers/postControllers');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.post('/', authMiddleware, createPost);
router.get('/', getPosts);
router.get('/popular', getPopularPosts);
router.get('/:id', getPost);
router.get('/categories/:category', getCatPosts);
router.patch('/:id', authMiddleware, editPost);
router.get('/users/:id', getUserPosts);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
