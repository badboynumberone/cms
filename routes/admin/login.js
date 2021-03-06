const router = require('koa-router')()
const DB = require("../../utils/db");
const svgCaptcha = require('svg-captcha');
const tools = require("../../utils/tools");
router.use(async (ctx,next)=>{
    await next();
})
//页面渲染
router.get('/', async (ctx,next) => {
    await ctx.render('admin/login')
    await next();
})

//登录
router.post("/doLogin",async(ctx) =>{
    // ctx.body="123"
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    console.log(ctx.request.body)
    let result = await DB.find("admin",{username,password:tools.md5(password)});
    if(result == false){//没有该用户
        ctx.status=200;
        ctx.body={code:1,"msg":"用户名或密码不正确，请重新输入"}
        // await ctx.render("admin/login")
        // ctx.redirect("/admin/user")
    }else{
        if(result[0].status){
            ctx.session.userinfo = result[0];
            ctx.status=200;
            ctx.body={code:0,"msg":"登录成功"}
        }else{
            ctx.body={code:1,"msg":"您的账号已被锁住,暂时无法登录"}
        }

        // ctx.redirect("/admin/user")
    }
})

//获取验证码
router.get('/captcha',async (ctx)=>{
    let captcha = svgCaptcha.create({
        size: 4,
        noise: 2,
        color: true,
        background: '#cc9966',
        width:100,
        height:35
    })
    ctx.cookies.set("code",captcha.text.toLowerCase(),{
        maxAge:1000*3600*24,
        httpOnly: false
    })
    ctx.response.type = "image/svg+xml";
    ctx.body = captcha.data;
});

//退出登录
router.get('/loginOut',async (ctx) =>{
    ctx.session.userinfo=null;
    ctx.body={"code":0,"msg":"退出登录成功"}
})

module.exports = router
