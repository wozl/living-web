<template>
        <video 
            id="videoElement" 
            controls 
            autoplay 
            muted 
            style="width: 80%;height:80%;object-fit:fill;" />
</template>

<script>
//import { reactive,toRefs} from '@vue/reactivity'
import flvjs from 'flv.js';
import {onMounted, watchEffect } from 'vue';
import { ref} from '@vue/reactivity';
    export default {
        name:"Video",
        props:{
            val:String
        },
       
        setup(props) {
            //将父组件传入的url声明为响应式(防止数据不同步)
            watchEffect(()=>{
                if(props.val==undefined){
                    return;
                }else{ //不是第一渲染，默认播放器已经生成
                    //销毁默认播放播放器实例
                    flv_destory();
                    //重新渲染新的动态播放器
                    change_flv(props.val);              
                }
            });
            let flvPlayer = ref();
            //创建flv播放器(默认cctv1)
            const flv = ()=>{
                let url ="/live/flv?port=1935&app=cctv1hd&stream=live";
                let videoElement = document.getElementById("videoElement");
                if(flvjs.isSupported()){
                    flvPlayer = flvjs.createPlayer({
                        type:'flv',
                        isLive:true,
                        hasAudio:true,
                        url
                    });
                    flvPlayer.attachMediaElement(videoElement);
                    flvPlayer.load();
                    flvPlayer.play();
                }
            };
            onMounted(() => {
                //创建默认的播放器
                flv();
            });
            
            //销毁flv
            const flv_destory = ()=>{
                if(flvPlayer){
                    flvPlayer.pause()
                    flvPlayer.unload()
                    flvPlayer.detachMediaElement()
                    flvPlayer.destroy()
                    flvPlayer = null
                }
            };
            const change_flv = (val)=>{
                let url =`/live/flv?port=1935&app=${val}&stream=live`;
                let videoElement = document.getElementById("videoElement");
                if(flvjs.isSupported()){
                    flvPlayer = flvjs.createPlayer({
                        type:'flv',
                        isLive:true,
                        hasAudio:true,
                        url
                    });
                    flvPlayer.attachMediaElement(videoElement);
                    flvPlayer.load();
                    flvPlayer.play();
                }
            };
            return{
              flv_destory,
              change_flv,
              
            }
        },
    }
</script>

<style lang="less" scoped>

</style>