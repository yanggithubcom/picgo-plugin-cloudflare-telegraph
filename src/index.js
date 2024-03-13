// const logger = require('@varnxy/logger')
// logger.setDirectory('/Users/zhang/Work/WorkSpaces/WebWorkSpace/picgo-plugin-cloudflare-telegraph/logs')
// let log = logger('plugin')

module.exports = (ctx) => {
  const register = () => {
    ctx.helper.uploader.register('cloudflare-telegraph', {
      handle,
      name: 'cloudflare-telegraph',
      config: config
    })
  }
  const handle = async function (ctx) {
    let userConfig = ctx.getConfig('picBed.cloudflare-telegraph')
    if (!userConfig) {
      throw new Error('Can\'t find uploader config')
    }
    const url = userConfig.url+"/upload"
    const paramName = "filename"
    const jsonPath = userConfig.url

    try {
      let imgList = ctx.output
      for (let i in imgList) {
        let image = imgList[i].buffer
        if (!image && imgList[i].base64Image) {
          image = Buffer.from(imgList[i].base64Image, 'base64')
        }
        const postConfig = postOptions(image,  url, paramName, imgList[i].fileName)
        let body = await ctx.Request.request(postConfig)

        delete imgList[i].base64Image
        delete imgList[i].buffer
        if (!jsonPath) {
          aaaa = JSON.parse(body)
          imgList[i]['imgUrl'] = aaaa[0].src
        } else {
          body = JSON.parse(body)
          let imgUrl =jsonPath + body[0].src
          if (imgUrl) {
            imgList[i]['imgUrl'] = imgUrl
          } else {
            ctx.emit('notification', {
              title: '返回解析失败',
              body: '请检查JsonPath设置'
            })
          }
        }


        // // 把链接保存到文本
        // const fs = require('fs');
        // const os = require('os');
        // // 文件路径，在用户目录.picgo/imgUrl.txt
        // const filePath = os.homedir()+ "/.picgo/imgUrl.txt";
        // // 要追加的内容
        // const contentToAppend = imgList[i]['imgUrl']+ "\n";

        // // 追加内容
        // fs.appendFile(filePath, contentToAppend, (err) => {
        //     if (err) {
        //         console.error('追加内容时出错：', err);
        //         return;
        //     }
        //     console.log('内容已成功追加到文件中。');
        // });
      }
    } catch (err) {
      ctx.emit('notification', {
        title: '上传失败',
        body: JSON.stringify(err)
      })
    }
  }

  const postOptions = (image, url, paramName, fileName) => {
    let headers = {
      contentType: 'multipart/form-data',
      'User-Agent': 'PicGo'
    }

    let formData = {}
    const opts = {
      method: 'POST',
      url: url,
      headers: headers,
      formData: formData
    }
    opts.formData[paramName] = {}
    opts.formData[paramName].value = image
    opts.formData[paramName].options = {
      filename: fileName
    }
    return opts
  }

  const config = ctx => {
    let userConfig = ctx.getConfig('picBed.cloudflare-telegraph')
    if (!userConfig) {
      userConfig = {}
    }
    return [
      {
        name: 'url',
        type: 'input',
        default: userConfig.url,
        required: true,
        message: 'https://xxx.pages.dev',
        alias: 'API地址'
      }
    ]
  }
  return {
    uploader: 'cloudflare-telegraph',
    // transformer: 'cloudflare-telegraph',
    // config: config,
    register

  }
}
