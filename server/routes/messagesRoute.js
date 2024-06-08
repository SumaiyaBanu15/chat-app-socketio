const { addMessage, getAllMessage } = require("../controller/messagesController.js");

const router = require("express").Router();

router.post("/addMsg", addMessage);
router.post("/getMsg", getAllMessage)

module.exports = router;

