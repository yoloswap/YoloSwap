require('babel-register')({
  presets: [ 'env' ],
  plugins: [
    ["transform-runtime", {
      polyfill: false,
      regenerator: true
    }]
  ]
});

module.exports = require('./app.js');
