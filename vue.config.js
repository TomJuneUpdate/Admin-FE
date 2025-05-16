const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
});
module.exports = {
  devServer: {
    port: 3000, // đổi 3000 thành cổng bạn muốn
  },
};
