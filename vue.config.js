module.exports={
    //此处设置的是项目访问的path，默认不配置的情况下是/根路径，这里进行配置是为了nginx中能够以该名称进行子目录访问
    publicPath: "/mytv/",
    outputDir:'mytvlive', //打包后的目录名称
    productionSourceMap:false, //打包不生成.map源文件，防止被反编译源代码
    devServer:{
        port:8981, //本地运行端口
        open:true, //启动后自动打开浏览器
        proxy:{ //请求跨域配置
            '/api':{
                target:'http://127.0.0.1:8899', //后台目标地址
                changeOrigin: true, //是否跨域
                ws: true, //是否代理ws
                //secure:false,  //是否https
                pathRewrite:{  //路径重置
                    '^/api':'' //将vue本地proxy伪代理前缀删除后去访问真实的地址(例如本地/api/a.json,移除后是代理地址+url，即xxxx:port/a.json)
                }

            },
            '/live':{
                target:'http://127.0.0.1', //nginx-flv直播目标地址
                changeOrigin: true, //是否跨域
                ws: true, //是否代理ws
                //secure:false,  //是否https
                pathRewrite:{  //路径重置
                    '^/live':'' //原理解释同上所诉
                }

            }
        }
    },
      
}