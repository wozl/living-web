# living-web

------

## 项目简介
> living-web是一个基于vue3和element-plus框架的响应式web前端项目，该项目主要是配合[livingServer][2]后端做的一个电视直播demo。创建该项目的目的主要是为了学习vue后实际应用下，就编写了该项目进行学习实践。该项目是由[vue-manage-system][1]修改而来，感谢这些优秀的开源项目。

## 项目目录
`docker->build->x86/arm`该目录是用于打包docker镜像的目录，目录中的Dockerfile是用于打包前端的文件，基于centos7镜像制作。Dockerfile_php_fpm是用于打包php运行环境的，DockerMysqlfile是制作数据库进行的文件。arm目录文件也是这三个，用于制作基于arm架构的docker镜像。<br/>

`docker->compose`该目录是给安装了docker-composer的用户准备的自动配置文件，否则你就需要一个一个的自己pull镜像后再运行镜像。这里也分别为x86和arm制作了脚本文件，需要注意的目录中的压缩文件是用于手动映射的本地文件，这里配置文件中我用的是linux的路径映射，windows的用户可以根据自己的实际路径进行修改。其中`livingServer.zip`是给php-fpm环境项目目录进行映射的项目文件，自行解压后修改compose文件中的路径为自己的实际解压路径即可。然后`mytvlive.zip`是给前端docker镜像中的nginx项目路径映射文件，解压后需要修改为mytv的目录名称。同时nginx还需要配置php后端映射，解压`livingServer.zip`后将其存放和修改名称后的mytv同级的目录即可。最后就是`live.conf`直播配置文件，该文件默认在docker前端镜像中的nginx配置文件中的conf.d目录下，需要对应映射本地目录到镜像中的该目录后将文件存放在本地的目录中。若你这边嫌弃麻烦，可修改compose配置文件，不进行映射，但是php-fpm是需要映射的，运行即可，只是Nginx这边的配置文件和项目没办法动态更新了。<br/>

`public`该目录为公共资源目录<br/>

`src`目录为项目工程资源目录，其中`assets`为公共资源目录，自定义的图片或者是样式等文件在该目录进行存放。`components`为通用模板文件夹，`router`为路由配置文件夹，`store`为本地缓存文件夹，`views`该目录存放你编写的vue页面文件。App.vue为入口模板文件，`main.js`为全局变量配置文件，这里你可以配置你需要的第三方组件，然后进行注册。<br/>

`vue.config.js`该配置文件主要是配置vue本地代理和打包等一些配置的配置文件，这个文件是后加的，具体用法大家可以自行查询资料，因为我也是初学者，嘿嘿。

## 项目使用方法

首先你需要有Node.js和npm环境，然后cd 到项目目录中运行
``` powershell
npm install
```
用于安装项目依赖，然后运行
``` powershell
npm run serve
```
项目就会运行，默认端口8080，不过我这边由于有vue.config.js配置文件，对运行端口进行了固定，端口为8981。然后就能看到首页了，不过这个首页请求的api也是依赖后端[livingServer][2]服务的，需要在配置文件中配置后端地址。<br/>
项目主要路径有`index->首页`,`login->登录页`,`home->后台主页`(需要登录，非登录不能访问，会被重定向到登陆页面)


[1]:https://github.com/lin-xin/vue-manage-system
[2]:https://github.com/wozl/living_server