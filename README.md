# picgo-plugin-cloudflare-telegraph

## [PicGo](https://github.com/Molunerfinn/PicGo) 插件

- 适配 Cloudflare Pages托管 [Telegraph-Image](https://github.com/cf-pages/Telegraph-Image)  项目的 [PicGo](https://github.com/Molunerfinn/PicGo) 插件。
-  [Telegraph-Image](https://github.com/cf-pages/Telegraph-Image) 是免费图片托管解决方案，Flickr/imgur替代品。使用Cloudflare Pages部署和图片保存在Telegraph。

### 提前准备

- 部署  [Telegraph-Image](https://github.com/cf-pages/Telegraph-Image)  项目，得到  `https://telegraph-image-xx.pages.dev` 图床链接。

  ![image-20240311113909254](https://telegraph-image-cpc.pages.dev/file/21687ad9ccdbe22b23a83.png)

## 使用

###  [PicGo](https://github.com/Molunerfinn/PicGo) 配置

- #### 安装插件

  ![image-20240311115910836](https://telegraph-image-cpc.pages.dev/file/588894320588b019732ae.png)

- #### 图床链接添加到API地址

  当用户名和密码为空是，在相册删除照片时，图床的图片不会删除。

  当填写用户名和密码，在相册删除照片时，图床的图片也一起删除。

  <font color=red>注</font> ：删除逻辑是把图片加入黑名单屏蔽图片链接实现，可以在图片管理网页加入白名单实现找回
  
  #### ![image-20240311113909254](https://telegraph-image-cpc.pages.dev/file/9e5d71f3a5c41e8557f6b.png)

### [PicGo-Core](https://picgo.github.io/PicGo-Core-Doc/) 配置

- #### 安装PicGo-Core

  1、下载 [picgo.exe](https://github.com/typora/PicGo-cli/releases) ，可以配置程序的环境变量（可选）

  2、使用 `npm` 全局安装 `npm install picgo -g`

- #### 安装插件

   输入执行
  
  ```
  D:\xxx\picgo.exe install cloudflare-telegraph
  ```
  
  or
  
  ```
  picgo install cloudflare-telegraph
  ```

- #### 配置文件 `~\.picgo\config.json` 参数设置

   ```
   {
     "picBed": {
       "uploader": "cloudflare-telegraph",
       "cloudflare-telegraph": {
         "url": "https://telegraph-image-xxx.pages.dev"
       }
     },
     "picgoPlugins": {
       "picgo-plugin-cloudflare-telegraph": true
     }
   }
   ```


- #### 测试

  准备一张图片

  ```
  D:\xxx\picgo.exe  upload D:\xxx\xx\xx.jpg
  ```

  or

  ```
  picgo u D:\xxx\xx\xx.jpg
  ```

### Typora 配置

#### 1、[PicGo (app)](https://github.com/Molunerfinn/PicGo) 配置

- 找到`PicGo.exe`的位置，后验证

  ![image-20240311234220468](https://telegraph-image-cpc.pages.dev/file/d93121c9757652cb9e094.png)

#### 2、[PicGo-Core](https://picgo.github.io/PicGo-Core-Doc/) 配置

- 使用Typora自带 [picgo.exe](https://github.com/typora/PicGo-cli/releases) 在目录`C:\\Users\\Usersname\\AppData\\Roaming\\Typora\\picgo\\win64\\picgo.exe`，

  配置文件在目录 `~\.picgo\config.json`

  ![image-20240311235331978](https://telegraph-image-cpc.pages.dev/file/7d51a5570783c3857bf05.png)

- 使用自己安装的 [picgo.exe](https://github.com/typora/PicGo-cli/releases)

  ```
  D:\xxx\picgo.exe  upload
  ```

    or

  ```
  picgo u
  ```

  ![image-20240311235127416](https://telegraph-image-cpc.pages.dev/file/57c4bdf8101eae07b3210.png)





