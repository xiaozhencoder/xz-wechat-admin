export const formValidate = {
  text: [{ key: "content", errorText: "请输入文本" }],
  msgmenu: [],
  mpnews: [],
  image: [{ key: "picUrl", errorText: "请选择图片素材" }],
  news: [
    { key: "title", errorText: "请输入自定义标题" },
    { key: "linkUrl", errorText: "请输入外链地址" },
    { key: "picUrl", errorText: "请选择自定义封面" }
  ],
  sms: [{ key: "content", errorText: "请输入短信内容" }],
  miniprogrampage: [
    { key: "appId", errorText: "请输入appId" },
    { key: "pagePath", errorText: "请输入小程序page页面" },
    { key: "title", errorText: "请输入自定义标题" },
    { key: "picUrl", errorText: "请输入自定义封面" }
  ],
  template: [{ key: "templateParameters", errorText: "请选择模板" }],
  voice: [{ key: "voiceUrl", errorText: "请上传音频" }],
  video: [
    { key: "title", errorText: "请输入自定义标题" },
    { key: "videoUrl", errorText: "请上传视频" },
    { key: "picUrl", errorText: "请上传视频封面" }
  ]
}
