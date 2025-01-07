import permission from "./permission"
//批量注册指令(现在就一个permission)
const directives = {
    permission
}
//注册的一般写法，循环遍历directives，通过vue.directive注册
export default {
    install(app){
        Object.keys(directives).forEach(key=>{
            app.directive(key, directives[key])
        })
    }
}