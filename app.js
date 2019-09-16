const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs=require("hbs");
const compression=require("compression");
const session=require("express-session");
const mainRouter = require('./routes/main');
const adminRouter=require("./routes/admin/admin");
const app = express();

// view engine setup
app.set('view engine', 'html'); //设置渲染页面的后缀名
app.set('views', path.join(__dirname, 'views'));//设置渲染页面的路径
app.engine("html", hbs.__express);//设置渲染页面的方式，hbs可以引入页面减少重复代码

hbs.registerPartials(path.join(__dirname,"views/share"));//注册可重复引入的页面路径

app.use(logger('dev'));//控制台输出日志
app.use(compression());//压缩响应数据，包括静态资源。必须中间件前面。
app.use(express.json());//解析JSON格式的请求
app.use(express.urlencoded({ extended: false }));//解析urlencoded格式的请求
app.use(cookieParser("my_session_key"));//解析请求中的cookie数据 参数为密钥
app.use(session({
  name:"session-name", //这里是cookie的name，默认是connect.sid
  secret:"my_session_key",  //cookie密钥
  resave:true, //是否允许多个请求并发时对session进行覆盖
  saveUninitialized:true, //初始化session时是否保存到存储
  cookie: { maxAge: 60 * 1000, httpOnly: true }  //设置cookie的最大长度，是否只允许http协议
}));
app.use(express.static(path.join(__dirname, 'public')));//设置静态文件目录



//拦截请求，判断是否登录
app.use(function(req,res,next){
  // 解析用户请求的路径
  let arr = req.url.split('/');
  // 去除 GET 请求路径上携带的参数
  for (let i = 0, length = arr.length; i < length; i++) {
    arr[i] = arr[i].split('?')[0];
  }
  let publicArr=["images","javascripts","lib","stylesheets"]; //无需登录即可访问的静态资源
  if (arr.length == 2 && arr[1] == '') { //根目录请求
    next();
  }else if(arr.length > 1 && publicArr.includes(arr[1])){  //如果为无需登录访问的静态资源
    next();
  }else if(arr.length > 2 && arr[1] == "admin"){ //如果为后台请求
    let uid=req.session.User.id;
    if(uid&&uid===req.signedCookies.uid){ //如果后台已登录
      next();
    }else if(arr[2] == 'register' || arr[2] == 'login' || arr[2] == 'logout'){ //如果为后台的注册，登录，登出
      next();
    }else{ // 后台登录拦截
      req.session.originalUrl = req.originalUrl ? req.originalUrl : null;  // 记录用户原始请求路径
      res.redirect('/admin/login');  // 将用户重定向到登录页面
    }
  }else{ //前台请求
    let code=req.session.code;
    if(code&&code===req.signedCookies.code){  //如果前台已登录
      next();
    }else if(arr.length > 2&&arr[1]=="index"&&(arr[2]=="into"||arr[2]=="quite")){ //如果为前台的登录，登出
      next();
    }else{
      req.session.originalUrl = req.originalUrl ? req.originalUrl : null;  // 记录用户原始请求路径
      res.redirect('/');  // 将用户重定向到登录页面
    }
  }
});

app.use('/', mainRouter);//前台入口
app.use("/admin",adminRouter);//后台管理入口

// 捕获404错误
app.use(function(req, res, next) { //如果资源请求不存在,创建404错误
  next(createError(404));
});

// 请求出错返回error页面
app.use(function(err, req, res, next) { 
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error',{error:err});
});

module.exports = app;
