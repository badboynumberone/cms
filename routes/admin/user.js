const router = require('koa-router')()
const DB = require("../../utils/db");
const tools =require("../../utils/tools");
router.use(async (ctx,next)=>{
    await next();
})
//管理员首页
router.get('/', async (ctx, next) => {
    await ctx.render('admin/index',{
    });
})

//管理员列表
router.get("/mangerList",async(ctx,next)=>{
    let result = await DB.find('admin',{});
    console.log(result)
    await ctx.render("admin/manager/list",{
        list:result
    });
})
//管理员编辑页面
router.get('/mangerEdit',async (ctx,next)=>{
    console.log(ctx.request.query.username)
    await ctx.render("admin/manager/edit",{
        name:ctx.request.query.username,
        userId:ctx.request.query.id
    });
})

//增加管理员页面
router.get('/mangerAdd',async (ctx,next)=>{
    await ctx.render("admin/manager/add");
})

//更改密码
router.post("/rePassword",async (ctx,next)=>{
    console.log(ctx.request.body)
    let res = DB.update("admin",{"_id":DB.getObjectId(ctx.request.body.userId)},{"password":tools.md5(ctx.request.body.password)});
    if(res){
        ctx.body={"ok":true,"msg":"更新密码成功"};
    }else{
        ctx.body={"ok":false,"msg":"更新密码失败,请稍后重试"};
    }
})

//更改使用管理员状态
router.get("/changeStatus",async(ctx,next)=>{
    let result = await DB.find(ctx.request.query.collection,{_id:DB.getObjectId(ctx.request.query.id)})
    if(result.length){
        let json = {};
        json[ctx.request.query.attr] = result[0][ctx.request.query.attr]? false:true;
        let res = await DB.update(ctx.request.query.collection,{_id:DB.getObjectId(ctx.request.query.id)},json);
        if(res){
            ctx.body={"message":"更新成功","success":true}
        }else{
            ctx.body = {"message":"更新失败","success":false}
        }
    }
    console.log(ctx.request.query)
    await next();
})

//添加管理员
router.post('/addmanager',async (ctx)=>{
    console.log(ctx.request.body)
    let result = await DB.find('admin',{"username":ctx.request.body.username});
    if(!result.length){
        let res = await DB.insert("admin",{"username":ctx.request.body.username,"password":tools.md5(ctx.request.body.password)})
        if(res){
            ctx.body={"ok":true,"msg":"管理员添加成功"};
        }else{
            ctx.body={"ok":false,"msg":"管理员添加失败,请稍后重试"};
        }
    }else{
        ctx.body={"ok":false,"msg":"该管理员已被添加，请勿重复操作"};
    }
})

//删除管理员
router.post('/deleteManager',async (ctx)=>{
    let result = await DB.find('admin',{"_id":DB.getObjectId(ctx.request.body.id)});
    let userId = ctx.session.userinfo._id;
    console.log(userId)
    if(result.length){
        let res = DB.remove("admin",{"_id":DB.getObjectId(ctx.request.body.id)});
        if(res){
            if(userId==ctx.request.body.id){
                ctx.session.userinfo=null;
            }
            ctx.body={"ok":true,"isMe":userId==ctx.request.body.id,"msg":"管理员删除成功"};
        }else{
            ctx.body={"ok":false,"msg":"管理员删除失败,请稍后重试"};
        }
    }else{
        ctx.body={"ok":false,"msg":"管理员已被删除,请勿重复操作"};
    }
})




module.exports = router