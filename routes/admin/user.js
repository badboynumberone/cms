const router = require('koa-router')()


router.use(async (ctx,next)=>{
    await next();
})

router.get('/', async (ctx, next) => {
    await ctx.render('admin/list', {
        title: 'Hello Koa 2!'
    })
})



module.exports = router