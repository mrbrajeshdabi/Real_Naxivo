const express = require("express");
const { testapi, register, login, allusers, update, Request, getrequest, notification, notificationupdation, accepteduserlistshow, setMessage, getmessage, deletemessage } = require("../controller/main.controller");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './profilepic')
  },
  filename: function (req, file, cb) {
    cb(null,`${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage: storage })

router.get("/testapi",testapi);
router.post("/register",register);
router.post("/logins",login);
router.get("/users",allusers);
router.post("/update",upload.single("profilepic"),update);
router.post("/request",Request);
router.get("/get-request",getrequest);
router.get("/notification",notification);
router.put("/notificationupdation",notificationupdation);
router.post("/accepteduserlist",accepteduserlistshow);
router.post("/message",setMessage);
router.post("/getmessage",getmessage);
router.delete("/deletemessage",deletemessage);

module.exports = {router};

