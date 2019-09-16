const express = require('express');
const router = express.Router();

router.get("/registerlist",function(req,res,next){
    res.render("oper/registerlist");
});
/** region data **/
function getRegisterList(){
    
}
/** 0 */
module.exports = router;