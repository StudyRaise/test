module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5, // Vant设计稿基准值(375px)
      propList: ['*'],
      selectorBlackList: ['.norem'] // 过滤不需要转换的类名
    }
  }
}
