var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import GlobalTarget from './GlobalTarget';
// We need this in order to not relay on the consumer to make sure that the context is updated
// With this pattern we need just to be sure the context is set at the first time, then we take care of updating it.
// The consumer should take care of propagating its own context

var CallbackContainer = function () {
  function CallbackContainer(renderInRemote, removeFromRemote) {
    _classCallCheck(this, CallbackContainer);

    this.renderInRemote = renderInRemote;
    this.removeFromRemote = removeFromRemote;
    this.subscriptions = [];
  }

  _createClass(CallbackContainer, [{
    key: 'setRenderFn',
    value: function setRenderFn(renderInRemote, removeFromRemote) {
      this.renderInRemote = renderInRemote;
      this.removeFromRemote = removeFromRemote;
      this.subscriptions.forEach(function (f) {
        return f();
      });
    }
  }, {
    key: 'subscribe',
    value: function subscribe(f) {
      this.subscriptions.push(f);
    }
  }]);

  return CallbackContainer;
}();

var RemoteFramesProvider = function (_Component) {
  _inherits(RemoteFramesProvider, _Component);

  function RemoteFramesProvider(props) {
    _classCallCheck(this, RemoteFramesProvider);

    var _this = _possibleConstructorReturn(this, (RemoteFramesProvider.__proto__ || Object.getPrototypeOf(RemoteFramesProvider)).call(this, props));

    _this.callBackContainer = new CallbackContainer(function (renderInformation) {
      if (_this.queue == null) {
        throw new Error('The queue in the RemoteFramesProvider was flushed, yet the RemoteFrame is trying to use the `renderInRemote` that will add to the queue. This means the RemoteFrame did not pick up the React.context update: check the elements in between, if they are intercepting the context in some way.');
      }
      _this.queue.push(['render', renderInformation]);
    }, function (jsx) {
      if (_this.queue == null) {
        throw new Error('The queue in the RemoteFramesProvider was flushed, yet the RemoteFrame is trying to use the `removeFromRemote` that will add to the queue. This means the RemoteFrame did not pick up the React.context update: check the elements in between, if they are intercepting the context in some way.');
      }
      _this.queue.push(['remove', jsx]);
    });
    _this.queue = [];
    return _this;
  }

  _createClass(RemoteFramesProvider, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.targetDomElement instanceof HTMLElement) {
        this.renderGlobalTarget(this.props.targetDomElement);
      } else {
        this.props.targetDomElement.then(this.renderGlobalTarget.bind(this));
      }
    }
  }, {
    key: 'renderGlobalTarget',
    value: function renderGlobalTarget(targetDomElement) {
      render(React.createElement(GlobalTarget, {
        onAddStackElement: this.props.onFrameAdded,
        onEmptyStack: this.props.onNoFrames,
        onReady: this.handleOnReady.bind(this)
      }), targetDomElement);
    }
  }, {
    key: 'handleOnReady',
    value: function handleOnReady(renderInRemote, removeFromRemote) {
      this.callBackContainer.setRenderFn(renderInRemote, removeFromRemote);
      this.queue.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            type = _ref2[0],
            renderInformation = _ref2[1];

        if (type === 'render') {
          renderInRemote(renderInformation);
        } else {
          removeFromRemote(renderInformation);
        }
      });

      delete this.queue;
    }
  }, {
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        callBackContainer: this.callBackContainer,
        remoteFrameContextTypes: this.props.contextTypes
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return RemoteFramesProvider;
}(Component);

RemoteFramesProvider.childContextTypes = {
  callBackContainer: PropTypes.object,
  remoteFrameContextTypes: PropTypes.object
};

export default RemoteFramesProvider;