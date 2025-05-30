const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:1503",
        changeOrigin: true,
        secure: false,
        ws: true,
        logLevel: "debug",
        onProxyReq: function(proxyReq, req, res) {
          console.log('Proxying request:', req.method, req.url);
        },
        onProxyRes: function(proxyRes, req, res) {
          console.log('Received response:', proxyRes.statusCode, req.url);
        },
        onError: function(err, req, res) {
          console.error('Proxy error:', err);
        }
      }
    }
  }
});
