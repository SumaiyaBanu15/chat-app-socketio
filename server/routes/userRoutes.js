const { signUp, login, setAvatar, getAllUsers } = require("../controller/userController");


const router = require("express").Router();

router.post("/signup",signUp);
router.post("/login",login)
router.post("/setAvatar/:id",setAvatar);
router.get("/allUsers/:id",getAllUsers);

module.exports = router;

