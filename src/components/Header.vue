<template>
<div>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">后台管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏按钮组件 -->
                <div class="btn-bell">
                    <!-- <el-button><i class="el-icon-full-screen"></i></el-button> -->
                    <el-tooltip effect="dark" content="全屏" placement="bottom">
                            
                            <i class="el-icon-full-screen" @click="fullscreen"></i>
                        
                    </el-tooltip>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="../assets/login_logo.jpg" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="up_pwd">修改密码</el-dropdown-item>
                            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
    <!-- 修改密码弹窗 -->
    <el-dialog title="修改密码" v-model="pwd_dialogFormVisible" width="50%">
        <template #title>
            <i class="el-icon-key"></i>&nbsp;
            <span>修改密码</span>
        </template>
        <!-- 中间内容 -->
        <el-form :model="pwd_queryInfo" :rules="pwd_rules" ref="pwd_ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名称:" prop="username">
                <el-input v-model="pwd_queryInfo.username" autocomplete="off" disabled="true"  :label-width="formLabelWidth"></el-input>
            </el-form-item>
            <el-form-item label="新的密码" prop="password">
                <el-input v-model="pwd_queryInfo.password" autocomplete="off" type="password"  :label-width="formLabelWidth"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="com_pwd">
                <el-input v-model="pwd_queryInfo.com_pwd" autocomplete="off" type="password" :label-width="formLabelWidth"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部按钮组 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="pwd_dialogFormVisible=false">取消</el-button>
                <el-button type="primary" @click="update_pwd()">确定</el-button>
            </span>
        </template>
    </el-dialog>       
</div>    
</template>
<script>
import { computed, onMounted,ref,reactive,toRefs} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';
import md5 from 'js-md5';
//导入全屏组件
import screenfull from 'screenfull'
export default {
    setup() {
        const username = localStorage.getItem("username");
        const message = 2; 
        //axios代理对象
        let { proxy } = getCurrentInstance();     
         //验证两次输入的密码是否一致
        let confirmPwd = (rule,value,callback)=>{
            console.log("触发确认密码验证")
            if(value===''){
                callback(new Error('请再次输入密码'));
            }else if(value!=state.pwd_queryInfo.password){
                callback(new Error('两次输入的密码不一致'));
            }else{
                callback();
            }
        };
        //开启网页全屏模式
        const fullscreen = ()=>{
            if(screenfull.isEnabled){
                screenfull.toggle();
            }
        };
        const state = reactive({
                pwd_dialogFormVisible:false, //修改密码弹窗显示/隐藏
                pwd_queryInfo:{ //修改密码表单数据对象
                    username:'', //用户名
                    password:'', //新密码
                    com_pwd:'' //确认密码
                },
                pwd_rules:{ //修改密码表单验证规则对象
                    username:[],
                    password:[
                        {
                            required: true,
                            message:'密码不能为空',
                            trigger: 'blur'
                        }
                    ],
                    com_pwd:[
                        {
                            validator:confirmPwd,
                            trigger:'blur',
                            required:true
                        }
                    ]
                },
                pwd_ruleForm:ref(), //修改密码表单引用对象

        });

        const store = useStore();
        const collapse = computed(() => store.state.collapse);
        // 侧边栏折叠
        const collapseChage = () => {
            store.commit("handleCollapse", !collapse.value);
        };

        onMounted(() => {
            if (document.body.clientWidth < 1500) {
                collapseChage();
            }
        });
        

        // 用户名下拉菜单选择事件
        const router = useRouter();
        const handleCommand = (command) => {
            if (command == "loginout") {
                localStorage.removeItem("username");
                router.push("/login");
            } else if (command == "up_pwd") {
                //router.push("/user");
                console.log("触发修改密码弹窗!");
                //初始化表单
                state.pwd_queryInfo.password='';
                state.pwd_queryInfo.com_pwd='';
                //显示弹窗
                state.pwd_dialogFormVisible=true;
                //当前登录系统的用户名
                state.pwd_queryInfo.username=localStorage.getItem("username");
            }
        };
        //提交更新密码请求
        const update_pwd = ()=>{
            state.pwd_ruleForm.validate(val=>{
                if(!val){
                     ElMessage.info({
                        message:'请确认表单是否符合填写规则!',
                        type:'info'
                    });
                    return;
                }else{ //将新密码提交到服务器
                    proxy.$axios.post('/api/updatePwd',
                        {"username":state.pwd_queryInfo.username,"password":md5(state.pwd_queryInfo.com_pwd)}
                        ).then(rep =>{
                            let res = rep.data;
                            if(res.code==200){
                                ElMessage.success({
                                    message:`${res.msg}请重新登录!`,
                                    type:'success'
                                });
                                //清理用户名
                                localStorage.removeItem("username");
                                //跳转到登录页面
                                router.push("/login");
                            }else{
                                ElMessage.error({
                                    message:`${res.msg}`,
                                    type:'error'
                                });
                            }
                        }).catch(()=>{
                             ElMessage.error({
                                message:'网络繁忙,请稍后再试!',
                                type:'error'
                            });
                        });
                }
            });
        };
        return {
            username,
            message,
            collapse,
            collapseChage,
            handleCommand,
            update_pwd,
            fullscreen,
            ...toRefs(state)
        };
    },
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-full-screen {
    color: #409EFF;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
.box{
    z-index: 0;
}

</style>
