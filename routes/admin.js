const router = require('koa-router')();
const url = require("url");
const DB = require("../utils/db");
var sd = require('silly-datetime');
router.prefix('/admin');


//改方法必须置前
router.use(async (ctx, next) => {
    let arr = url.parse(ctx.url).pathname.split("/");
    pathItem = "/"+arr[1]+"/"+arr[2];
    ctx.state = {
        pathItem,
        pathname:url.parse(ctx.url).pathname,
        __HOST__: "http://" + ctx.header.host
    };
    let pathname = url.parse(ctx.url).pathname;
    if (ctx.session.userinfo) {
        ctx.state.username = ctx.session.userinfo.username;
        let result = await DB.update("admin",{"username":ctx.session.userinfo.username},{"last_time":sd.format(new Date(), 'YYYY-MM-DD HH:mm')})
        await next();
    } else {
        if (pathname == "/admin/login" || pathname == "/admin/login/doLogin" || pathname == "/admin/login/captcha" ) {
            await next()
        } else {
            ctx.redirect("/admin/login")
        }
    }
})

router.get('/', async (ctx, next) => {
    await ctx.render('admin/index');
})


//加载login模块路由
const login = require("./admin/login");
router.use("/login", login.routes());

//加载user模块路由
const user = require("./admin/user");
router.use("/user", user.routes());

module.exports = router
