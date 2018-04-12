'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _remoteFrame = require('./remote-frame');

Object.defineProperty(exports, 'RemoteFrame', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_remoteFrame).default;
  }
});

var _RemoteFramesProvider = require('./RemoteFramesProvider');

Object.defineProperty(exports, 'RemoteFramesProvider', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_RemoteFramesProvider).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }