let app = {
    toggle(el,collection,attr,id){
        $.get("/admin/user/changeStatus",{"collection":collection,"attr":attr,"id":id},function(data){
            if(data.success){
                if(el.src.indexOf('yes')!=-1) {
                    el.src = "/admin/images/no.gif"
                }else{
                    el.src = "/admin/images/yes.gif"
                }
            }
        })
    }
}