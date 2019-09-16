const express = require('express');
const router = express.Router();
const operRouter=require("./registerSystem/oper");
const IDB=require("../common/IDB");
const Result=require("../models/Result");

router.get('/', function(req, res, next) {
  res.render('index');
});
router.post('/index/into',function(req,res,next){
  let result=new Result();
  let key=req.body.code;
  if(key){
    let sql=`select count(id) as idCount from afauthorize where guid='${key}'`;
    IDB.query(sql).then(data=>{
      if(data&&data.length>0&&data[0].idCount>0){
        result.setSuccess(true);
        req.session.code=key;
        res.cookie("code",key,{'signed': true});
      }else{
        result.setMessage("用户码不存在!");
      }
      res.json(result);
    }).catch(err=>{
      result.setMessage(new Error().toString());
      res.json(result);
    });
  }else{
    result.setMessage("用户码不能为空!");
    return res.json(result);
  }
});
router.post('/index/quite',function(req,res,next){
  let result=new Result();
  try{
    req.session.destroy();
    result.setSuccess(true);
  }catch(err){
    result.setMessage(err.toString());
  }
  return res.json(result);
});
router.use("/oper",operRouter);

module.exports = router;
