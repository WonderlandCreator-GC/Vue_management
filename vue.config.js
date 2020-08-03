module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'plugins': '@/plugins'
      }
    }
  },
  // lintOnSave: false
}
