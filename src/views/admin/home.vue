<template>
<div>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 条件检索区 -->
        <el-row>  
            <!-- 开始时间 -->
            <el-col>
                <span>开始时间：</span>
                <el-date-picker
                    v-model="start_time"
                    type="datetime"
                    editable="false"
                    placeholder="选择日期时间">
                </el-date-picker>
                 <!-- 结束时间 -->
                <span style="padding-left:1.5em;">结束时间：</span>
                 <el-date-picker
                    v-model="end_time"
                    type="datetime"
                    editable="false"
                    placeholder="选择日期时间">
                </el-date-picker>
                <!-- 搜索框 -->
                <el-input placeholder="请输入搜索内容" maxlength="10" show-word-limit v-model="text" style="width:18%;padding-left:1.5em;" clearable @clear="int_clean">
                    </el-input>
                <!-- 搜索按钮 -->
                <el-button icon="el-icon-search" @click="search"></el-button>
                <!-- 添加频道按钮 -->
                <el-button type="primary" @click="show_add()">添加频道</el-button>
                <!-- 下载配置文件按钮 -->
                 <el-tooltip class="item" effect="dark" content="点击下载配置文件" placement="top">
                    <el-button type="success" @click="download_conf()"><i class="el-icon-download"></i></el-button>
                </el-tooltip>
            </el-col>
        </el-row>
        <!-- 频道信息列表 -->
        <el-table :data="liveList"
            v-loading="isLoding"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            >
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="频道" prop="name"></el-table-column>
            <el-table-column label="播放地址" prop="url"></el-table-column>
            <el-table-column label="台标" prop="icon"></el-table-column>
            <el-table-column label="备注" prop="remarks"></el-table-column>
            <el-table-column label="创建时间" prop="created_at" :formatter="dateFormat"></el-table-column>
            <el-table-column label="更新时间" prop="updated_at" :formatter="dateFormat"></el-table-column>
            <el-table-column label="操作" width="200px">
                <template #default="scope">
                    <!-- 修改按钮 -->
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)">编辑</el-button>
                    <!-- 删除按钮 -->
                         <el-popconfirm
                            confirmButtonText='好的'
                            cancelButtonText='不用了'
                            icon="el-icon-info"
                            iconColor="red"
                            title="这是一段内容确定删除吗？"
                            @cancel="cancel_del()"
                            @confirm="del(scope.row.id)"
                            >
                            <template #reference>
                                <el-button  type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </template>
                         </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="queryInfo.total">
        </el-pagination>
    </el-card>
    <!-- 编辑弹窗 -->
    <el-dialog title="编辑" v-model="edit_dialogFormVisible" width="50%">
       <template #title>
           <i class="el-icon-edit"></i>&nbsp;
           <span>编辑&nbsp;--&nbsp;{{ edit_form.name }}</span>
       </template>
        <el-form :model="edit_form" ref="editFormRef" :rules="editFormRules">
            <el-form-item label="频道">
                <el-input v-model="edit_form.name" prop="name" autocomplete="off" :label-width="formLabelWidth"></el-input>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="edit_form.url" prop="url" autocomplete="off" :label-width="formLabelWidth"></el-input>
            </el-form-item>
            <el-form-item label="台标">
                <el-input v-model="edit_form.icon" prop="icon" autocomplete="off" :label-width="formLabelWidth"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="edit_form.remarks" prop="remarks" autocomplete="off" :label-width="formLabelWidth"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部按钮组 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="edit_dialogFormVisible=false">取消</el-button>
                <el-button type="primary" @click="up_edit()">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 新增频道弹窗 -->
    <el-dialog title="添加频道" v-model="add_dialogFormVisible" width="50%">
       <template #title>
           <i class="el-icon-document-add"></i>&nbsp;
           <span>添加频道</span>
       </template>
        <el-form :model="add_Form" :rules="add_rules" ref="add_ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="频道名称" prop="name">
                <el-input v-model="add_Form.name" autocomplete="off" :label-width="formLabelWidth"></el-input>
            </el-form-item>
            <el-form-item label="频道地址" prop="url">
                <el-input v-model="add_Form.url" autocomplete="off" :label-width="formLabelWidth"></el-input>
            </el-form-item>
            <el-form-item label="频道台标" prop="icon">
                <el-input v-model="add_Form.icon" autocomplete="off" :label-width="formLabelWidth"></el-input>
            </el-form-item>
            <el-form-item label="频道备注" prop="remarks">
                <el-input v-model="add_Form.remarks" autocomplete="off" :label-width="formLabelWidth"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部按钮组 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="add_dialogFormVisible=false">取消</el-button>
                <el-button type="primary" @click="addLiveInfo()">确定</el-button>
            </span>
        </template>
    </el-dialog>
</div>    
</template>

<script>
import { reactive,ref,toRefs} from '@vue/reactivity'
import { ElMessage } from 'element-plus'
import { onMounted,getCurrentInstance} from 'vue'
import moment from 'moment'
    export default {
        setup() {
            
            const state = reactive({
                start_time:'', //开始时间
                end_time:'', //结束时间
                queryInfo:{ //分页数据对象
                    pagenum: 1, //初始页码
                    pagesize: 10, //每页默认条数
                    total:0, //总数据条数             
                },
                text:'', //搜索框对象
                liveList:[], //频道数据列表
                isLoding: true, //显示加载动画
                edit_dialogFormVisible: false, //编辑对话框(默认隐藏)
                formLabelWidth:'120px', //表单编辑框长度
                edit_form:{ //编辑表单数据对象
                    id:0, //频道id
                    name:'', //频道名称
                    url:'', //频道播放地址
                    icon:'', //频道图标
                    remarks:'', //频道备注
                },
                editFormRules:{ //编辑表单验证规则对象
                    name:[
                            {
                                
                                required: true,
                                message:'频道名称不能为空',
                                trigger: 'blur'
                            }, 
                        
                    ],
                    url:[
                            {
                                required: true,
                                message:'频道地址不能为空',
                                trigger: 'blur'
                            }
                    ],
                    icon:[],
                    remarks:[
                        {
                            required: true,
                            message:'频道备注信息不能为空',
                            trigger: 'blur'
                        }
                    ]
                },
                editFormRef:ref(), //编辑表单引用对象
                add_Form:{ //新增频道表单数据对象
                    name:'', //频道名称
                    url:'', //频道地址
                    icon:'', //频道台标
                    remarks:'' //频道备注
                },
                add_rules:{ //新增频道信息表单验证规则
                    name:[
                        {
                            required: true,
                            message:'频道名称不能为空',
                            trigger: 'blur'
                        },
                    ],
                    url:[
                        {
                            required: true,
                            message:'频道地址不能为空',
                            trigger: 'blur'
                        },
                    ],
                    icon:[],
                    remarks:[
                        {
                            required: true,
                            message:'频道备注不能为空',
                            trigger: 'blur'
                        },
                    ]
                },
                add_dialogFormVisible:false, //添加表单显示/隐藏
                
            });
            let add_ruleForm=ref(); //新增频道表单引用对象
            //搜索单击处理函数
            const search= (()=>{
                const arr = reactive([]);
                //初始化页码
                state.queryInfo.pagenum=1;
                if(state.text!='' && (state.start_time!='' && state.start_time!=null ) && (state.end_time!='' && state.end_time!=null )){ //三个条件都满足时
                    arr.push({
                        pageNum:state.queryInfo.pagenum,
                        pageSize:state.queryInfo.pagesize,
                        query:state.text,
                        startTime:(parseInt(moment(state.start_time).valueOf())/1000),
                        endTime:(parseInt(moment(state.end_time).valueOf())/1000)
                    });
                }else if(state.text!='' && (state.end_time!='' && state.end_time!=null )){ //仅包含结束时间和搜索条件
                    arr.push({
                        pageNum:state.queryInfo.pagenum,
                        pageSize:state.queryInfo.pagesize,
                        query:state.text,
                        endTime:(parseInt(moment(state.end_time).valueOf())/1000)
                    });
                }else if((state.end_time!='' && state.end_time!=null)){ //仅包含结束时间时
                    arr.push({
                        pageNum:state.queryInfo.pagenum,
                        pageSize:state.queryInfo.pagesize,
                        endTime:(parseInt(moment(state.end_time).valueOf())/1000)
                    });
                }else if(state.text!='' && (state.start_time!='' && state.start_time!=null )){ //仅包含开始时间和查询条件时
                    arr.push({
                        pageNum:state.queryInfo.pagenum,
                        pageSize:state.queryInfo.pagesize,
                        query:state.text,
                        startTime:(parseInt(moment(state.start_time).valueOf())/1000),
                    });
                }else if((state.start_time!='' && state.start_time!=null )){ //仅包含开始时间时
                    arr.push({
                        pageNum:state.queryInfo.pagenum,
                        pageSize:state.queryInfo.pagesize,
                        startTime:(parseInt(moment(state.start_time).valueOf())/1000),
                    });
                }else if(state.text!=''){ //仅包含查询条件时
                    arr.push({
                        pageNum:state.queryInfo.pagenum,
                        pageSize:state.queryInfo.pagesize,
                        query:state.text,
                    });
                }else{ //所有条件都不包含时
                    console.log("执行所有数据列表");
                    //默认请求所有数据列表
                    getLiveInfo();
                    return;
                }
                //开始执行搜索请求
                proxy.$axios.post('/api/getUrlInfo',arr[0]).then(rep=>{
                    let res = rep.data;
                    if(res.meta.code==200){
                        //总数据条数
                        state.queryInfo.total=res.total;
                        //数据列表数据
                        let list = res.data;
                        state.liveList= list;
                        //禁用加载动画  
                        state.isLoding=false;
                        ElMessage.success({
                            message:'列表加载成功!',
                            type:'success'
                        });
                    }else{
                        ElMessage.error({
                            message:res.meta.msg,
                            type:'error'
                        });
                    }
                }).catch(()=>{
                    ElMessage.error({
                            message:'网络繁忙,请稍后再试!',
                            type:'error'
                        });   
                    });
            });
            //axios代理对象
            let { proxy } = getCurrentInstance();
            //组件挂载时立即执行
            onMounted(() => {
                getLiveInfo();
            });
            //查询电视台直播数据列表
            const getLiveInfo=(()=>{
                proxy.$axios.post('/api/getUrlInfo',{"pageNum":state.queryInfo.pagenum,"pageSize":state.queryInfo.pagesize}).then(rep =>{
                        let res =rep.data;
                        if(res.meta.code===200){
                            //总数据条数
                            state.queryInfo.total=res.total;
                            //数据列表数据
                            let list = res.data;
                            state.liveList= list;
                            //禁用加载动画  
                            state.isLoding=false;
                            ElMessage.success({
                                message:'列表加载成功!',
                                type:'success'
                            });
                        }else{
                            ElMessage.error({
                                message:res.meta.msg,
                                type:'error'
                            });
                        } 
                }).catch(()=>{
                    ElMessage.error({
                        message:'网络繁忙',
                        type:'error'
                    });
                });
            });

            //编辑数据
            const edit= (obj)=>{
                state.edit_form.id=obj.id; //频道id
                state.edit_form.name=obj.name; //频道名
                state.edit_form.url=obj.url; //频道地址
                state.edit_form.icon=obj.icon; //频道台标
                state.edit_form.remarks=obj.remarks; //备注
                //显示编辑表单
                state.edit_dialogFormVisible=true;
            };
            const cancel_del = ()=>{
                ElMessage.info({
                    message:'删除已取消!',
                    type:'info'
                });
            };
            //删除数据
            const del = (id)=>{
                console.log(`删除的id为：${id}`);
                proxy.$axios.post('/api/delLiveInfoById',{"id":id}).then(rep=>{
                    let res = rep.data;
                    if(res.meta.code==200){
                        ElMessage.success({
                                message:res.meta.msg,
                                type:'success'
                            });
                            //初始页码为1,防止动态更新后多次请求
                            state.queryInfo.pagenum=1;
                            //刷新列表
                            getLiveInfo();
                    }else{
                        ElMessage.error({
                                message:res.meta.msg,
                                type:'error'
                            });
                    }
                }).catch(()=>{
                    ElMessage.error({
                            message:'网络繁忙,删除失败!',
                            type:'error'
                        });
                });
            };
            //每页多少条变更时
            const handleSizeChange =(val) =>{
                state.queryInfo.pagesize=val;
                //刷新列表
                getLiveInfo();
            };
            //页码发生改变时
            const handleCurrentChange = (val)=>{
                state.queryInfo.pagenum=val;
                //刷新列表
                getLiveInfo();
            };
            //格式化时间戳
           const dateFormat = (row,column)=>{
               let date = row[column.property];
               if(date == undefined){
                   return '';
               }else{
                   return moment(parseInt(date*1000)).format("YYYY-MM-DD HH:mm:ss");
               } 
            };
            //提交编辑后的频道信息
            const up_edit= ()=>{
                state.editFormRef.validate(val=>{ //验证表单规则是否通过
                    if(!val){
                         ElMessage.info({
                            message:'请确认表单是否符合填写规则!',
                            type:'info'
                        });
                        return;
                    }else{ //提交编辑后的内容到服务器保存
                        proxy.$axios.post("/api/updateLiveInfo",state.edit_form).then(rep=>{
                                let res = rep.data;
                                if(res.meta.code==200){
                                     ElMessage.success({
                                        message:res.meta.msg,
                                        type:'success'
                                    });
                                    //隐藏编辑对话框
                                    state.edit_dialogFormVisible=false;
                                    //刷新频道数据列表
                                    getLiveInfo();
                                }else{
                                    //隐藏编辑对话框
                                    state.edit_dialogFormVisible=false;
                                    ElMessage.error({
                                        message:res.meta.msg,
                                        type:'error'
                                    });
                                }
                        }).catch(()=>{
                            ElMessage.error({
                                message:'网络繁忙,更新失败!',
                                type:'error'
                            });
                        });
                    }
                });
            };
            //显示添加频道弹窗
            const show_add=()=>{
                if(add_ruleForm.value===undefined){ //新增表单有内容时初始化表单内容
                    state.add_dialogFormVisible=true;
                    return;
                }else{
                    //清空表单数据
                    add_ruleForm.value.resetFields();
                    //显示弹窗
                    state.add_dialogFormVisible=true;
                }
            };
            //提交新增的频道数据
            const addLiveInfo=()=>{
                add_ruleForm.value.validate(val=>{
                    if(!val){ //表单规则验证未通过
                        ElMessage.info({
                            message:'请确认表单是否符合填写规则!',
                            type:'info'
                        });
                        return;
                    }else{
                        proxy.$axios.post('/api/addLive',state.add_Form).then(rep =>{
                            let res = rep.data;
                            if(res.meta.code==200){ //新增成功
                                ElMessage.success({
                                        message:res.meta.msg,
                                        type:'success'
                                });
                                //隐藏弹出框
                                state.add_dialogFormVisible=false;
                                //
                                //刷新数据列表
                                getLiveInfo();
                            }else{
                                ElMessage.error({
                                        message:res.meta.msg,
                                        type:'error'
                                });
                                //隐藏弹出框
                                state.add_dialogFormVisible=false;
                            }
                        }).catch(()=>{
                             ElMessage.error({
                                message:'网络繁忙,新增失败!',
                                type:'error'
                            });
                        });
                    }
                });
            };
            /**
             * 搜索框内容被清空时触发
             * 这里仅重新请求默认的获取列表数据对象重新请求
             * 不对开始时间和结束时间是否存在值时分情况去请求
             * 感兴趣的可以自行研究
             */
            const int_clean=()=>{
                console.log("搜索框内容被清除啦!");
                //初始化页码
                state.queryInfo.pagenum=1;
                //加载列表数据
                 getLiveInfo();
            };
            //下载配置文件
            const download_conf=()=>{
                proxy.$axios.get('/api/downloadConfigFile',{responseType:'blob'}).then(rep=>{
                    const {data,headers} = rep;
                    //文件名
                    const filename = headers['content-disposition'].substr( headers['content-disposition'].indexOf("=")+1);
                    const blob = new Blob([data],{type:headers['content-type']});
                    //其实就是创建一个a标签，将接收的数据放入a标签的href，通过模拟dom点击去调用浏览器的下载
                    let dom = document.createElement('a');
                    let url = window.URL.createObjectURL(blob);
                    dom.href = url;
                    dom.download = decodeURI(filename);
                    dom.style.display = 'none';
                    //挂载创建的a标签
                    document.body.appendChild(dom);
                    dom.click();
                    //移除创建的a标签
                    document.body.removeChild(dom);
                    //是否blob url地址
                    window.URL.revokeObjectURL(url);
                }).catch(()=>{
                    ElMessage.error({
                            message:'网络繁忙,下载失败!',
                            type:'error'
                        });
                });
            };
           
            //返回数据对象
            return{
                ...toRefs(state),
                search,
                edit,
                del,
                cancel_del,
                dateFormat,
                handleSizeChange,
                handleCurrentChange,
                up_edit,
                show_add,
                add_ruleForm,
                addLiveInfo,
                int_clean,
                download_conf,
            }
        }
    }
</script>

<style lang="less" scoped>

</style>