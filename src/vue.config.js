// vue.config.js
module.exports = {
    devServer: {
        port: process.env.VUE_APP_PORT || 8080,
        proxy: {
            '/api': {
                target: 'https://stg-env.visionpay.app',
                changeOrigin: true,
                secure: true, // Set to false if SSL cert is not valid
                pathRewrite: { '^/api': '' }, // Rewrite /api prefix if needed
                onProxyReq: (proxyReq, req, res) => {
                    // Ensure the correct origin header is sent to the backend
                    proxyReq.setHeader('Origin', 'http://https://stg-env.visionpay.app');
                }
            }
        }
    }
};
