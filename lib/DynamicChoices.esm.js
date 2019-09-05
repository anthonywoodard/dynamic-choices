"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _choices = _interopRequireDefault(require("choices.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _default(_ref) {
  var _ref$defaultConfig = _ref.defaultConfig,
      defaultConfig = _ref$defaultConfig === void 0 ? {} : _ref$defaultConfig,
      _ref$paramConfig = _ref.paramConfig,
      paramConfig = _ref$paramConfig === void 0 ? {} : _ref$paramConfig;
  var CONFIG_OVERRIDES = {
    noChoicesText: '',
    shouldSort: false,
    searchChoices: false,
    removeItemButton: true,
    duplicateItemsAllowed: false
  };
  var PARAM_CONFIG_DEFAULT = {
    boxId: '',
    boxClassNames: '',
    searchButtonId: '',
    searchButtonTitle: 'Search',
    searchButtonClassNames: '',
    searchButtonInnerHtml: 'Search',
    clearButtonId: '',
    clearButtonTitle: 'Clear',
    clearButtonClassNames: '',
    clearButtonInnerHtml: 'Clear',
    transformValueFnc: false,
    apiUrl: '',
    xhrProgressCallback: false,
    searchValue: 'id',
    labelValue: 'text',
    xhrErrorCallback: false,
    xhrMethod: 'POST',
    xhrHeaders: [{
      'Content-type': 'application/x-www-form-urlencoded'
    }],
    xhrResponseType: 'json',
    xhrQueryKey: '',
    lookupDelay: 300,
    searchButtonClickCallback: false,
    addChoiceCallback: false,
    removeItemCallback: false
  };
  var config = {
    placeholderValue: 'Start typing',
    itemSelectText: 'Press enter to select',
    classNames: {
      containerOuter: 'choices',
      containerInner: 'choices__inner',
      listItems: 'choices__list--multiple',
      item: 'choices__item',
      highlightedState: 'is-highlighted',
      button: 'choices__button',
      input: 'choices__input',
      listDropdown: 'choices__list--dropdown',
      itemSelectable: 'choices__item--selectable'
    }
  };

  if (defaultConfig === Object(defaultConfig)) {
    Object.assign(config, defaultConfig, CONFIG_OVERRIDES);
  } else {
    Object.assign(config, CONFIG_OVERRIDES);
  }

  if (paramConfig === Object(paramConfig)) {
    paramConfig = Object.assign({}, PARAM_CONFIG_DEFAULT, paramConfig);
  } else {
    paramConfig = PARAM_CONFIG_DEFAULT;
  }

  var DynamicChoices =
  /*#__PURE__*/
  function (_HTMLElement) {
    _inherits(DynamicChoices, _HTMLElement);

    function DynamicChoices() {
      _classCallCheck(this, DynamicChoices);

      return _possibleConstructorReturn(this, _getPrototypeOf(DynamicChoices).apply(this, arguments));
    }

    _createClass(DynamicChoices, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        this._serverLookup = this._serverLookup.bind(this);
        this._searchEvent = this._searchEvent.bind(this);
        this._choiceEvent = this._choiceEvent.bind(this);
        this._searchButtonClick = this._searchButtonClick.bind(this);
        this._clearButtonClick = this._clearButtonClick.bind(this);
        this._addItemEvent = this._addItemEvent.bind(this);
        this._removeItemEvent = this._removeItemEvent.bind(this);
        this._lookupTimeout = null;
        this.render();
        var dc = this.querySelector('[data-hook="DynamicChoices"]'); // Trigger an API lookup when the user pauses after typing.

        dc.addEventListener('search', this._searchEvent); // We want to clear the API-provided options when a choice is selected.

        dc.addEventListener('choice', this._choiceEvent); // Other events

        dc.addEventListener('addItem', this._addItemEvent);
        dc.addEventListener('removeItem', this._removeItemEvent);
        this.querySelector('[data-hook="DynamicChoices-search"]').addEventListener('click', this._searchButtonClick);
        this.querySelector('[data-hook="DynamicChoices-clear"]').addEventListener('click', this._clearButtonClick);
      }
    }, {
      key: "render",
      value: function render() {
        var _this = this;

        this.innerHTML = "\n        <style>\n          .".concat(config.classNames.containerOuter, " {\n            flex: 1 !important;\n            margin-bottom: 0;\n          }\n        </style>\n        <div id=\"").concat(paramConfig.boxId, "\" class=\"").concat(paramConfig.boxClassNames, "\" style=\"display: flex;\">\n          <select data-hook=\"DynamicChoices\" multiple></select>\n          <button id=\"").concat(paramConfig.clearButtonId, "\" title=\"").concat(paramConfig.clearButtonTitle, "\" data-hook=\"DynamicChoices-clear\" class=\"").concat(paramConfig.clearButtonClassNames, "\" style=\"display:none;\">").concat(paramConfig.clearButtonInnerHtml, "</button>\n          <button id=\"").concat(paramConfig.searchButtonId, "\" title=\"").concat(paramConfig.searchButtonTitle, "\" data-hook=\"DynamicChoices-search\" class=\"").concat(paramConfig.searchButtonClassNames, "\">").concat(paramConfig.searchButtonInnerHtml, "</button>\n        </div>");
        this._choices = new _choices.default('[data-hook="DynamicChoices"]', config);

        this._choices.input.element.addEventListener('focus', function (e) {
          _this.querySelector(".".concat(config.classNames.listDropdown)).style.display = 'none';
        });

        this._choices.input.element.addEventListener('keyup', function (e) {
          if (e.target.value !== '') {
            _this.querySelector(".".concat(config.classNames.listDropdown)).style.display = '';
          } else {
            _this.querySelector(".".concat(config.classNames.listDropdown)).style.display = 'none';
          }
        });

        this._choices.input.element.addEventListener('blur', function (e) {
          _this.querySelector(".".concat(config.classNames.listDropdown)).style.display = 'none';
        });
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        var dc = this.querySelector('[data-hook="DynamicChoices"]');
        dc.removeEventListener('search', this._searchEvent);
        dc.removeEventListener('choice', this._choiceEvent);
        dc.removeEventListener('addItem', this._addItemEvent);
        dc.removeEventListener('removeItem', this._removeItemEvent);
        this.querySelector('[data-hook="DynamicChoices-search"]').removeEventListener('click', this._searchButtonClick);
        this.querySelector('[data-hook="DynamicChoices-clear"]').removeEventListener('click', this._clearButtonClick);

        this._choices.destroy();
      }
    }, {
      key: "_log",
      value: function _log() {
        var _console;

        console.group('dynamic-choices');

        (_console = console).log.apply(_console, arguments);

        console.groupEnd();
      }
    }, {
      key: "_serverLookup",
      value: function _serverLookup(val) {
        var _this2 = this;

        var query = this._choices.input.value || val || '';

        if (query === '') {
          this._choices.clearChoices();
        } else {
          if (typeof paramConfig.transformValueFnc === 'function') {
            query = paramConfig.transformValueFnc(query);
          }
        }

        if (paramConfig.apiUrl !== '') {
          var xhr = new XMLHttpRequest(); // call progress callback

          if (typeof paramConfig.xhrProgressCallback === 'function') {
            xhr.upload.addEventListener('progress', paramConfig.xhrProgressCallback);
          } // response received/failed


          xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4) {
              var results = xhr.response;
              var isEmptyResults = false;

              if (Array.isArray(results)) {
                results.map(function (obj) {
                  var cp = obj.customProperties = {};

                  for (var k in obj) {
                    if (k !== 'customProperties') {
                      cp[k] = obj[k];
                    }
                  }
                });

                if (results.length === 0) {
                  // used to clear items list if results array is empty
                  results = [' '];
                  isEmptyResults = true;
                }

                if (val && isEmptyResults === false) {
                  var exact = results.map(function (obj, index) {
                    if (obj[paramConfig.searchValue] === query || obj[paramConfig.searchValue] === val) {
                      return index;
                    }
                  }).filter(function (x) {
                    return x > -1;
                  });

                  if (exact.length > 0) {
                    results[exact[0]].selected = true;
                  }
                }

                _this2._choices.setChoices(results, paramConfig.searchValue, paramConfig.labelValue, true);

                if (_this2._choices.input.value !== '' && isEmptyResults === false) {
                  _this2.querySelector(".".concat(config.classNames.listDropdown)).style.display = '';
                }
              }
            }
          };

          if (typeof paramConfig.xhrErrorCallback === 'function') {
            xhr.onerror = paramConfig.xhrErrorCallback;
          }

          xhr.open(paramConfig.xhrMethod, paramConfig.apiUrl, true);
          xhr.responseType = paramConfig.xhrResponseType;

          if (Array.isArray(paramConfig.xhrHeaders)) {
            for (var x = 0; x < paramConfig.xhrHeaders.length; x++) {
              var xh = paramConfig.xhrHeaders[x];

              for (var h in xh) {
                xhr.setRequestHeader(h, xh[h]);
              }
            }
          }

          var xhrQueryKey = paramConfig.xhrQueryKey !== '' ? paramConfig.xhrQueryKey + '=' : '';
          xhr.send(xhrQueryKey + query);
        }
      }
    }, {
      key: "_searchEvent",
      value: function _searchEvent() {
        clearTimeout(this._lookupTimeout);
        this._lookupTimeout = setTimeout(this._serverLookup, paramConfig.lookupDelay);
      }
    }, {
      key: "_choiceEvent",
      value: function _choiceEvent(e) {
        this._choices.clearChoices();
      }
    }, {
      key: "_searchButtonClick",
      value: function _searchButtonClick(e) {
        if (e && e.preventDefault) {
          e.preventDefault();
        }

        if (typeof paramConfig.searchButtonClickCallback === 'function') {
          paramConfig.searchButtonClickCallback(e);
        }
      }
    }, {
      key: "_clearButtonClick",
      value: function _clearButtonClick(e) {
        if (e && e.preventDefault) {
          e.preventDefault();
        }

        var event = new Event('beforeClearAll');
        this.dispatchEvent(event);
        this.removeChoices();
      }
    }, {
      key: "_addItemEvent",
      value: function _addItemEvent(e) {
        this.querySelector('[data-hook="DynamicChoices-clear"]').style = 'display:block;';

        this._choices.hideDropdown(true);

        if (typeof paramConfig.addChoiceCallback === 'function') {
          paramConfig.addChoiceCallback(this.getChoices(true));
        } else {
          this._searchButtonClick();
        }
      }
    }, {
      key: "_removeItemEvent",
      value: function _removeItemEvent(e) {
        var gc = this.getChoices(true);

        if (gc.length === 0) {
          this.querySelector('[data-hook="DynamicChoices-clear"]').style = 'display:none;';
        }

        if (typeof paramConfig.removeItemCallback === 'function') {
          paramConfig.removeItemCallback();
        }
      }
    }, {
      key: "addChoice",
      value: function addChoice(paramObj) {
        if (paramObj && paramObj.hasOwnProperty('value')) {
          var val = paramObj.value;

          if (paramObj.hasOwnProperty('removeAll') && paramObj.removeAll === true) {
            this._choices.removeActiveItems();
          } else {
            var gc = this.getChoices();
            var obj = gc.find(function (c) {
              return c.label === val;
            });

            if (obj) {
              this._choices.removeActiveItemsByValue(obj.value);
            }
          }

          this._serverLookup(val);
        }
      }
    }, {
      key: "removeChoices",
      value: function removeChoices() {
        this._choices.removeActiveItems();
      }
    }, {
      key: "removeChoiceByValue",
      value: function removeChoiceByValue(val) {
        this._choices.removeActiveItemsByValue(val);
      }
    }, {
      key: "getChoices",
      value: function getChoices(arrayOnly) {
        return this._choices.getValue(arrayOnly || false);
      }
    }]);

    return DynamicChoices;
  }(_wrapNativeSuper(HTMLElement));

  window.customElements.define('dynamic-choices', DynamicChoices);
  return document.querySelector('dynamic-choices');
}