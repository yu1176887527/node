const express = require('express');
const router = express.Router();
const indexRouter=require("./index");
const loginRouter=require("./login");

router.use("/",indexRouter);
router.use("/login",loginRouter);

module.exports=router;
