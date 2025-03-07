module.exports = (ctx) => {
  // 提取基础 URL 的工具函数
  const getBaseUrl = (url) => {
    const parts = url.split('/');
    return `${parts[0]}//${parts[2]}`;
  };

  // 删除图片的逻辑（实际是加入黑名单）
  // 实际操作删除时 telegraph 不会删除图片，删除图片的链接依旧可用，
  // 只是在管理页面不再显示而已，重新上传也不显示，所以删了个寂寞，
  // 但是黑名单和白名单可以控制访问
  const handleRemove = async (files, guiApi) => {
    const { username, password } = ctx.getConfig('picBed.cloudflare-telegraph') || {};

    // 检查是否配置了用户名和密码
    if (!username || !password) {
      ctx.emit('notification', {
        title: '删除失败',
        body: '未配置用户名或密码',
      });
      return;
    }

    for (const file of files) {
      try {
        const baseUrl = getBaseUrl(file.imgUrl);
        const imgName = file.imgUrl.split('/').pop();
        const deleteUrl = `${baseUrl}/api/manage/block/${imgName}`;

        await ctx.Request.request({
          method: 'GET',
          url: deleteUrl,
          headers: {
            Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
            'User-Agent': 'PicGo',
          },
        });
      } catch (err) {
        ctx.emit('notification', {
          title: '删除失败',
          body: `文件 ${file.imgUrl} 删除失败: ${err.message}`,
        });
      }
    }
  };

  // 上传图片的逻辑
  const handleUpload = async (ctx) => {
    const userConfig = ctx.getConfig('picBed.cloudflare-telegraph');

    if (!userConfig?.url) {
      throw new Error('请配置上传地址');
    }

    const uploadUrl = `${userConfig.url}/upload`;

    try {
      for (const output of ctx.output) {
        const image = output.buffer || Buffer.from(output.base64Image, 'base64');
        const fileName = output.fileName;

        const response = await ctx.Request.request({
          method: 'POST',
          url: uploadUrl,
          headers: {
            contentType: 'multipart/form-data',
            'User-Agent': 'PicGo',
          },
          formData: {
            file: {
              value: image,
              options: {
                filename: fileName,
              },
            },
          },
        });

        delete output.buffer;

        if (response) {
          output.imgUrl = `${userConfig.url}${JSON.parse(response)[0].src}`;
        }
      }
    } catch (err) {
      ctx.emit('notification', {
        title: '上传失败',
        body: err.message,
      });
      throw err;
    }
  };

  // 配置项
  const config = (ctx) => {
    const userConfig = ctx.getConfig('picBed.cloudflare-telegraph') || {};

    return [
      {
        name: 'url',
        type: 'input',
        default: userConfig.url,
        required: true,
        message: 'https://xxx.pages.dev',
        alias: 'API地址',
      },
      {
        name: 'username',
        type: 'input',
        default: userConfig.username,
        required: false,
        message: 'username',
        alias: '用户名',
      },
      {
        name: 'password',
        type: 'input',
        default: userConfig.password,
        required: false,
        message: 'password',
        alias: '密码',
      },
    ];
  };

  // 注册插件
  const register = () => {
    ctx.helper.uploader.register('cloudflare-telegraph', {
      handle: handleUpload,
      name: 'cloudflare-telegraph',
      config: config,
    });

    // 监听删除事件
    ctx.on('remove', handleRemove);
  };

  return {
    uploader: 'cloudflare-telegraph',
    register,
  };
};