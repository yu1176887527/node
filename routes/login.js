const express=require("express");
const router=express.Router();
const IDB=require("../common/IDB");

router.get("/",(req,res,next)=>{
    res.render("login");
});
router.post("/login",(req,res,next)=>{
    let model=new Object();
    model.uname=req.param["uname"];
    model.upwd=req.param["upwd"];
    IDB.addData("user",model).then(result=>{
        
    }).catch();
});

module.exports=router;