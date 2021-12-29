import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入element-ui 组件
import ElementPlus from 'element-plus'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/lib/theme-chalk/index.css'
//导入zui库(css,js)这里只使用zui的css图标库
import './assets/zui/css/zui.min.css'
import axios from 'axios'; //导入axios组件
import './assets/css/icon.css'
//element消息组件
import { ElMessage } from 'element-plus'

const app = createApp(App);


//axios响应拦截器
axios.interceptors.response.use(config=>{
      return config    
},e=>{
    if(e.response.status==419){
        ElMessage.error({
            message:'登录超时，请重新登录!',
            type:'error'
        });
        //重定向到登录页面
        return router.replace('/login');
    }
});

//路由拦截，需要登录后的路径未登录不允许访问
router.beforeEach((to, from, next) => {
    if(to.path ==='/login' || to.path==='/index'){ //首页或者是登录页不验证是否登录
        next(); //放行路由
    }else{
        if(localStorage.getItem("username")){ //这里仅对本地存储指定变量是否存在进行了验证，实际项目中是会验证session中的token是否失效的
            next();
        }else{
            ElMessage.error({
                message:"未登录，请登录后再访问!",
                type:'error'
            });
            next({path:'/login'});//重定向到登录页面
        }
    }
    
});

//配置axios为全局变量
app.config.globalProperties.$axios = axios;
app.use(store).
    use(router).
    //注册element-plus
    use(ElementPlus,{ locale,size: 'small', zIndex: 3000 }).
    mount('#app')
