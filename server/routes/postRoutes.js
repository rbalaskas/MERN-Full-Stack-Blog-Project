const { Router } = require('express');
const { createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost, getPopularPosts,incrementViewCountPost } = require('../controllers/postControllers');
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
router.put('/:id/views', incrementViewCountPost);


module.exports = router;
