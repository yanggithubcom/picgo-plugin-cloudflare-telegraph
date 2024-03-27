module.exports = (ctx) => {
  let url ;
  let username ;
  let password ;

  const register =  () => {
    ctx.helper.uploader.register('cloudflare-telegraph', {
      handle,
      name: 'cloudflare-telegraph',
      config: config
    })
    ctx.on('remove', (files, guiApi) =>  {
      for (let i in files) {
        // 提取图片名字
        const imgUrl = files[i]['imgUrl'];
        const startIndex = imgUrl.indexOf('file/') + 'file/'.length;
        const imgName = imgUrl.substring(startIndex);
        // 删除图片URL
        const imgDeleteUrl = url + "/api/manage/delete/"+imgName;

        let body =getOptions(imgDeleteUrl);
      }
    })
  }

  const getOptions = async function (url) {
    return await ctx.Request.request({
          method: 'get',
          url: url,
          headers: {
            'Authorization': 'Basic ' + Buffer.from(username+":"+password).toString('base64'),
            'User-Agent': 'PicGo'
          }
        });

  }

  const handle = async function (ctx) {
    let userConfig = ctx.getConfig('picBed.cloudflare-telegraph')
    if (!userConfig) {
      throw new Error('Can\'t find uploader config')
    }
    url = userConfig.url
    username = userConfig.username
    password = userConfig.password
    const paramName = "filename"
    const jsonPath = userConfig.url

    try {
      let imgList = ctx.output
      for (let i in imgList) {
        let image = imgList[i].buffer
        if (!image && imgList[i].base64Image) {
          image = Buffer.from(imgList[i].base64Image, 'base64')
        }
        const postConfig = postOptions(image,  url+"/upload", paramName, imgList[i].fileName)
        let body = await ctx.Request.request(postConfig)

        delete imgList[i].base64Image
        delete imgList[i].buffer
        let jsonbody = JSON.parse(body)
        if (!jsonPath) {
          imgList[i]['imgUrl'] = jsonbody[0].src
        } else {
          let imgUrl =jsonPath + jsonbody[0].src
          if (imgUrl) {
            imgList[i]['imgUrl'] = imgUrl
          } else {
            ctx.emit('notification', {
              title: '返回解析失败',
              body: '请检查JsonPath设置'
            })
          }
        }
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
      },
      {
        name: 'username',
        type: 'input',
        default: userConfig.username,
        required: false,
        message: 'username',
        alias: '用户名'
      },
      {
        name: 'password',
        type: 'input',
        default: userConfig.password,
        required: false,
        message: 'password',
        alias: '密码'
      }
    ]
  }
  return {
    uploader: 'cloudflare-telegraph',
    // transformer: 'cloudflare-telegraph',
    // DELregister: DELregister,
    register

  }
}
