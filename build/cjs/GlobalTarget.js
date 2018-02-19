'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _recompose = require('recompose');

var _equals = require('ramda/src/equals');

var _equals2 = _interopRequireDefault(_equals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var setContextComponentsCache = [];

var createSetContextComponent = function createSetContextComponent() {
  var contextTypes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var cachedSetContextComponents = setContextComponentsCache.filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        cachedContextTypes = _ref2[0];

    return (0, _equals2.default)(cachedContextTypes, contextTypes);
  });

  if (cachedSetContextComponents.length === 1) {
    return cachedSetContextComponents[0][1];
  }

  var SetContextComponent = (0, _recompose.withContext)(contextTypes, function (props) {
    return _extends({}, props.context);
  })(function (_ref3) {
    var children = _ref3.children;
    return _react2.default.createElement(
      'div',
      null,
      children
    );
  });

  setContextComponentsCache.push([contextTypes, SetContextComponent]);

  return SetContextComponent;
};

var GlobalTarget = function (_Component) {
  _inherits(GlobalTarget, _Component);

  function GlobalTarget() {
    _classCallCheck(this, GlobalTarget);

    var _this = _possibleConstructorReturn(this, (GlobalTarget.__proto__ || Object.getPrototypeOf(GlobalTarget)).call(this));

    _this.stackTypes = [];

    _this.SetContextComponent = createSetContextComponent({});

    _this.state = {
      stack: []
    };
    return _this;
  }

  _createClass(GlobalTarget, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.renderInRemote = function (_ref4) {
        var jsx = _ref4.jsx,
            context = _ref4.context,
            contextTypes = _ref4.contextTypes;

        _this2.SetContextComponent = createSetContextComponent(contextTypes);

        if (_this2.stackTypes.filter(function (type) {
          return type === jsx.type;
        }).length === 0) {
          _this2.stackTypes = [].concat(_toConsumableArray(_this2.stackTypes), [jsx.type]);

          _this2.setState(function (_ref5) {
            var stack = _ref5.stack;
            return {
              context: context,
              stack: [].concat(_toConsumableArray(stack), [jsx])
            };
          });

          _this2.props.onAddStackElement(jsx);
        } else {
          _this2.setState(function (_ref6) {
            var stack = _ref6.stack;
            return {
              context: context,
              stack: stack.map(function (item) {
                return item.type === jsx.type ? jsx : item;
              })
            };
          });
        }
      };

      this.removeFromRemote = function (jsx) {
        _this2.stackTypes = _this2.stackTypes.filter(function (type) {
          return type !== jsx.type;
        });

        _this2.setState(function (_ref7) {
          var stack = _ref7.stack;
          return {
            stack: stack.filter(function (_ref8) {
              var type = _ref8.type;
              return type !== jsx.type;
            })
          };
        }, function () {
          if (_this2.state.stack.length === 0) {
            _this2.props.onEmptyStack(jsx);
          }
        });
      };

      this.props.onReady(this.renderInRemote, this.removeFromRemote);
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          context = _state.context,
          stack = _state.stack;


      return _react2.default.createElement(
        this.SetContextComponent,
        { context: context },
        stack.map(function (jsx, index) {
          return _react2.default.createElement(
            'div',
            { key: index, style: { display: index === stack.length - 1 ? 'block' : 'none' } },
            jsx
          );
        })
      );
    }
  }]);

  return GlobalTarget;
}(_react.Component);

GlobalTarget.defaultProps = {
  onAddStackElement: function onAddStackElement() {},
  onEmptyStack: function onEmptyStack() {}
};

exports.default = GlobalTarget;