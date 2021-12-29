import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
   path:'', //默认重定向到首页
   redirect: '/index'
  },
  {
    path:'/index', //首页
    component:() =>import('../views/index')
  },
  {
    path:'/login', //登录页
    component:() =>import('../views/login')
  },
  {
    path:'/home', //后台首页
    name:"home",
    component:()=>import('../views/admin/index'),
    redirect: 'ad_index',
    children:[
      {
        path:'/ad_index',
        name:"ad_index",
        meta:{
          title:"首页"
        },
        component:() =>import('../views/admin/home')
      }
    ],
    
  },
  {
    path:'/404', //404页面
    name:'404',
    component:()=>import('../views/404')
  },
  {
    path:'/:pathMatch(.*)', //当访问路径无匹配时跳转到404页面
    redirect: '/404'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  base:'/mytv/', //配置Nginx访问结构，若不配置你nginx中只能占用一个server下的location /路径
  scrollBehavior: ()=> ({y:0}), //防止a页面跳转到b页面之后，b页面的位置还停留在a页面位置
  routes,
})

export default router
