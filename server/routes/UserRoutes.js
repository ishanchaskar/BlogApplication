const { Router } = require("express");
const router = Router();
const  {getAuthors , getUser , registerUser , loginUser , editUser ,  changeAvatar} = require("../controllers/userController")
const authMiddleware = require("../middleware/authMiddleware")
router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/:id", getUser)
router.get("/", getAuthors)
router.post("/change-avatar", authMiddleware, changeAvatar)
router.patch("/edit-user",authMiddleware, editUser)


module.exports = router;
