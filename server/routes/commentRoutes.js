// routes/commentRoutes.js
const { Router } = require('express');
const { addComment, getCommentsByPost, deleteComment, likePost } = require('../controllers/commentControllers');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.post('/:postId', authMiddleware, addComment);
router.get('/:postId', getCommentsByPost);
router.delete('/:commentId', authMiddleware, deleteComment);
router.patch('/:postId/like', authMiddleware, likePost);

module.exports = router;
