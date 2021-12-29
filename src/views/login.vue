<template>
    <div class="login_container" :style="{backgroundImage: 'url(' + bgkImgUrl + ')', backgroundSize:'100% 100%', backgroundRepeat: 'no-repeat'}">
        <div class="login_box">
            <!-- 登录面板头像 -->
            <div class="avatar_box">
                <img src="../assets/login_logo.jpg" alt=""/>
            </div>
            <!-- 登录表单 
            -->
             <el-form :model="Login_form" 
                :rules="Login_rules" 
                class="login_form" 
                ref="refLogin" 
                label-width="0px"
                >
                <!-- 用户名 -->
                <el-form-item  prop="username">
                    <el-input prefix-icon="icon icon-user" v-model="Login_form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item  prop="password">
                    <el-input @keydown.enter="login()"  type="password" prefix-icon="icon icon-key" v-model="Login_form.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login()">登录</el-button>
                    <el-button type="info" @click="cleanForm()">重置</el-button>
                </el-form-item>
             </el-form>
        </div>
    </div>
</template>

<script>
//引入md5加密模块
    import md5 from 'js-md5'
    export default {
        created() { 
            //页面创建前获取背景图片地址
            this.getbrckImg();
            //请求后端csrf令牌，添加到请求头验证
            this.$axios.get('/api/token').then(res =>{
                this.$axios.defaults.headers.common['X-CSRF-TOKEN']=res.data;
                this.$axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            });
        },
        data() {
            return {
                //登录表单数据对象
                Login_form:{
                    username:'',
                    password:''
                },
                //登录表单验证规则
                Login_rules:{
                    username:[ //对输入的用户名进行校验
                        {
                            required:true,
                            message:'请输入用户名',
                            trigger:'blur'
                        },
                        
                    ],
                    password:[ //密码校验规则
                        {
                            required:true,
                            message:'请输入密码',
                            trigger:'blur'
                        }
                    ]
                },
                //背景图片地址
                bgkImgUrl:''
            }
        },
        methods: {
            async getbrckImg(){ //获取背景图片地址
                let _this = this;
                await this.$axios.get('https://www.liangquanhot.cn/img/').then(rep =>{
                    let res =rep.data;
                    _this.bgkImgUrl=res.imgurl;
                    _this.$message.success("获取图片地址成功!");
                }).catch(()=>{
                    this.$message.error("网络错误!");
                });
            },
            cleanForm(){//清空表单内容
                this.$refs.refLogin.resetFields();
            },
            login(){ //登录
                //先验证表单内容是否通过规则检查
                this.$refs.refLogin.validate(async val=>{
                    if(!val){ //验证不通过
                        this.$message.warning("请检查填写内容是否正确!");
                        return;
                    }else{ //发起登录请求
                        let _this= this;
                        //路由
                        //将输入的密码进行md5加密
                        _this.Login_form.password=md5(this.Login_form.password);
                        await _this.$axios.post('/api/login',
                            _this.Login_form
                            )
                        .then(rep=>{
                            let res = rep.data;
                            if(res.code==200){
                                _this.$message.success(res.msg);
                                //将当前用户名存储到localStorage中
                                localStorage.setItem('username',_this.Login_form.username)
                                //跳转到后台主页
                                _this.$router.push("/home");
                            }else{
                                _this.$message.error(res.msg);
                            }
                        }).catch(()=>{
                            _this.$message.error("网络错误,登录失败!");
                        });
                    }
                });
            }
        },
    }
</script>


<style lang="less" scoped>
    .login_container {
    background-color: rgb(233,236,243);
    height: 100%;
  }

  .login_box{
    width: 450px;
    height: 300px;
    background:rgba(245,247,250,0.7);
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
    z-index: 2;
  }
  .btns{
    display: flex;
    justify-content: flex-end;
    float: right;
    z-index: 4;
  }

  .login_form{
    position:absolute;
    bottom: 50px;
    width: 100%;
    padding:  0 20px;
    box-sizing: border-box;
    z-index: 3;
  }
  
</style>