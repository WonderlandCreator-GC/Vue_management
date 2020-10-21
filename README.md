# Vue-Shop-Management-System
## 1.项目简介
 &nbsp;&nbsp;&nbsp;&nbsp;此项目为商场后台管理系统，基于Vue+element-ui开发，包含登录、用户管理，权限管理，分类管理，参数管理，商品管理，数据报表统计等多个功能子模块。GitHub仓库包含项目前端部分源代码。
 
## 2.项目开发模式
&nbsp;&nbsp;&nbsp;&nbsp;采用前后端分离的开发模式，其中前端项目是基于Vue技术栈的SPA项目

## 3.前端技术栈
 &nbsp;&nbsp;&nbsp;（1）使用 vue-router 开发SPA单页应用  
 &nbsp;&nbsp;&nbsp;（2）使用 axios与后端进行数据交互  
 &nbsp;&nbsp;&nbsp;（3）使用 element-ui 组件库构建组件的界面  
 &nbsp;&nbsp;&nbsp;（4）使用Echarts技术构建数据报表  
 
## 4.项目预览

## 5.该项目的优化策略

**（1）生成打包报告**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通过可视化ui面板直接查看报告(通过控制台和分析面板)，观察项目哪部分模块存在文件体积较大的问题，基于此进行针对性优化  
**（2）为开发模式与发布模式指定不同的打包入口**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认情况下,vue项目的开发与发布模式,共用同一个打包的入口文件(即src/main.js),为了将项目的开发过程与发布过程分离,可以为两种模式,各自指定打包的入口文件,即:开发模式入口文件 src/main-dev.js，发布模式入口文件 src/main-prod.js。  
**（3）第三方库启用CDN，通过externals加载外部cdn资源**     
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了解决 chunk-vendors体积过大问题,通过webpack的externals节点,来配置加载外部的cdn资源,凡是声明在externals中的第三方依赖包,都不会被打包。  
**（4）Element-UI组件按需加载**  
**（5）使用路由懒加载**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;安装@babel/plugin-syntax-dynamic-import包，在babel.config.js配置文件声明该插件，将路由改为按需加载形式。
