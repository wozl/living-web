<template>
  <div>
    <el-container>
      <el-menu
        default-active="12"
        class="el-menu-vertical-demo"
        style="height: 100vh; width: 230px; float: left; overflow-y: auto"
      >
        <!-- 菜单列表 -->
        <el-menu-item
          @click="change_channel(item.remarks)"
          v-for="item in menuInfo"
          :index="item.id"
          :key="item.id"
        >
          <i class="{{ item.icon }}"></i>
          <template #title>{{ item.name }}</template>
        </el-menu-item>
      </el-menu>
      <!-- 主体内容区 -->
      <el-main>
        <Video ref="ref_video" :val="val" @test1="test1"></Video>
      </el-main>
    </el-container>
  </div>
</template>

<script>
//import { reactive,toRef} from '@vue/reactivity';
import Video from "../views/play.vue";
import { getCurrentInstance, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
export default {
  components: {
    Video,
  },
  setup() {
    //视频播放组件
    const ref_video = ref();
    //给子组件的播放地址
    let val = ref();
    //左侧菜单
    const menuInfo = ref([]);
    //axios代理对象
    let { proxy } = getCurrentInstance();

    const getMenu = () => {
      //获取左侧菜单列表信息
      proxy.$axios
        .post("/api/menuInfo")
        .then((rep) => {
          let res = rep.data;
          if (res.code == 200) {
            ElMessage.success({
              message: "频道信息加载成功!",
              type: "success",
            });
            //赋值给菜单列表
            menuInfo.value = res.data;
            //console.log(menuInfo.value)
          } else {
            ElMessage.error({
              message: "频道信息加载失败!",
              type: "error",
            });
          }
        })
        .catch(() => {
          ElMessage.warning({
            message: "网络繁忙，加载频道列表失败，请稍后再试!",
            type: "warning",
          });
        });
    };

    //测试调用视频组件中方法
    const change_channel = (value) => {
      //接收切换频道参数
      console.log(value);
      //将值动态传入子组件用于切换频道
      val.value=value;
    };
    onMounted(() => {
      //获取频道列表
      getMenu();
    });

    return {
      menuInfo,
      ref_video,
      change_channel,
      val,
    };
  },
};
</script>

<style lang="less" scoped>
</style>