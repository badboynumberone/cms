const Koa = require('koa')
const app = new Koa()
const path = require("path");
// e监听错误
const onerror = require('koa-onerror')
onerror(app)

// 处理post请求
const bodyparser = require('koa-bodyparser')
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

//定义session
const session = require('koa-session');
app.keys = ['some secret hurr'];
const CONFIG = {
  key: 'koa:sess', /*不需要配置 */
  maxAge: 1000*3600*24,//过期时间
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** 没有效果 */
  httpOnly: false, /** 是否只有服务器端可以获取cookie */
  signed: true, /** 是否开启签名 */
  rolling: true, /** 是否每次请求都去设置session,需要修改*/
  renew: false, //快过期的时候才去设置session，需要修改
};
app.use(session(CONFIG,app))

//定义cookie


//对返回json数据进行反序列化
const json = require('koa-json')
app.use(json())

// 日记打印
const logger = require('koa-logger')
app.use(logger())

//配置模板引擎
// const render = require('koa-art-template');
// render(app, {
//   root: path.join(__dirname, 'views'),
//   extname: '.html',
//   debug: process.env.NODE_ENV !== 'production'
// });
let views = require("koa-views");
let ejs = require("ejs");
app.use(views(path.join(__dirname,"views"),{
  map:{html:'ejs'}
}))

//静态文件托管
app.use(require('koa-static')(__dirname + '/public'))

//路由的配置
const admin = require('./routes/admin')
const users = require('./routes/users')
//全局路由入口
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
//启动路由
app.use(admin.routes(), admin.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// 监听错误处理
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
app.listen(3000)
console.log("正在监听3000端口")
module.exports = app
