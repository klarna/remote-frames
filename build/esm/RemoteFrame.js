var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import equals from 'ramda/src/equals';

var capturedContextComponentsCache = [];

var doRemoteRender = function doRemoteRender(renderInRemote, context, contextTypes, children) {
  renderInRemote({
    jsx: children,
    context: Object.keys(contextTypes).reduce(function (contextSoFar, key) {
      return _extends({}, contextSoFar, _defineProperty({}, key, context[key]));
    }, {}),
    contextTypes: contextTypes
  });
};

var createCapturedContextComponent = function createCapturedContextComponent() {
  var contextTypes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var cachedCapturedContextComponents = capturedContextComponentsCache.filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        cachedContextTypes = _ref2[0];

    return equals(cachedContextTypes, contextTypes);
  });

  if (cachedCapturedContextComponents.length === 1) {
    return cachedCapturedContextComponents[0][1];
  }

  var CapturedContextComponent = function (_Component) {
    _inherits(CapturedContextComponent, _Component);

    function CapturedContextComponent() {
      _classCallCheck(this, CapturedContextComponent);

      return _possibleConstructorReturn(this, (CapturedContextComponent.__proto__ || Object.getPrototypeOf(CapturedContextComponent)).apply(this, arguments));
    }

    _createClass(CapturedContextComponent, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var renderInRemote = this.context.renderInRemote;
        var children = this.props.children;


        doRemoteRender(renderInRemote, this.context, _extends({ renderInRemote: PropTypes.func }, contextTypes), children);
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        return !equals(this.props.children, nextProps.children);
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        var renderInRemote = this.context.renderInRemote;
        var children = this.props.children;


        doRemoteRender(renderInRemote, this.context, _extends({ renderInRemote: PropTypes.func }, contextTypes), children);
      }
    }, {
      key: 'render',
      value: function render() {
        return null;
      }
    }]);

    return CapturedContextComponent;
  }(Component);

  CapturedContextComponent.contextTypes = _extends({
    renderInRemote: PropTypes.func
  }, contextTypes);

  CapturedContextComponent.childContextTypes = _extends({
    renderInRemote: PropTypes.func
  }, contextTypes);

  capturedContextComponentsCache.push([contextTypes, CapturedContextComponent]);

  return CapturedContextComponent;
};

var RemoteFrame = function (_Component2) {
  _inherits(RemoteFrame, _Component2);

  function RemoteFrame(props, context) {
    _classCallCheck(this, RemoteFrame);

    var _this2 = _possibleConstructorReturn(this, (RemoteFrame.__proto__ || Object.getPrototypeOf(RemoteFrame)).call(this, props, context));

    if (context.removeFromRemote != null) {
      _this2.CapturedContextComponent = createCapturedContextComponent(_extends({}, context.remoteFrameContextTypes, props.contextTypes, RemoteFrame.contextTypes));
    }
    return _this2;
  }

  _createClass(RemoteFrame, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.context.removeFromRemote != null) {
        this.CapturedContextComponent = createCapturedContextComponent(_extends({}, this.context.remoteFrameContextTypes, nextProps.contextTypes, RemoteFrame.contextTypes));
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.context.removeFromRemote != null) {
        this.context.removeFromRemote(this.props.children);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.CapturedContextComponent != null) {
        return React.createElement(this.CapturedContextComponent, this.props);
      } else {
        return this.props.children;
      }
    }
  }]);

  return RemoteFrame;
}(Component);

RemoteFrame.contextTypes = {
  removeFromRemote: PropTypes.func,
  remoteFrameContextTypes: PropTypes.object
};

export default RemoteFrame;