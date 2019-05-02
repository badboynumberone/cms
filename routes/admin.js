const router = require('koa-router')();
const url = require("url");
router.prefix('/admin');


//改方法必须置前
router.use(async (ctx, next) => {
    ctx.state = {
        __HOST__: "http://" + ctx.header.host
    };
    let pathname = url.parse(ctx.url).pathname;
    console.log(ctx.session.userinfo)
    if (ctx.session.userinfo) {
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
