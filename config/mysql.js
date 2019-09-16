const mysql=require("mysql");
const pool=mysql.createPool({
    host:'localhost',
    user:'mq',
    password:'mq',
    database:'product',
    port:3306
});
module.exports=pool;
