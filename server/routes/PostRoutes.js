const { Router } = require("express");
const router  = Router();
const {deletePosts , editPost , getUsersPosts , getPost , getCatPosts , createPost , getPosts} = require("../controllers/postController")
const authMiddleware = require("../middleware/authMiddleware")

router.post('/',authMiddleware ,  createPost)
router.get('/',  getPosts)
router.get('/:id',  getPost)
router.get('/categories/:category',  getCatPosts)
router.get('/users/:id',  getUsersPosts)
router.patch('/:id',authMiddleware ,  editPost) // changed to edit
router.delete('/:id',authMiddleware ,   deletePosts)

module.exports = router;