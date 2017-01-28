/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = angular;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

var _treeView = __webpack_require__(5);

var _treeView2 = _interopRequireDefault(_treeView);

var _TreeView = __webpack_require__(3);

var _TreeView2 = _interopRequireDefault(_TreeView);

var _TreeGenerator = __webpack_require__(2);

var _TreeGenerator2 = _interopRequireDefault(_TreeGenerator);

var _TreeViewController = __webpack_require__(4);

var _TreeViewController2 = _interopRequireDefault(_TreeViewController);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var _module = _angular2.default.module('ngTreeView', []);

_module.directive('treeView', _treeView2.default).factory('TreeView', _TreeView2.default).factory('TreeGenerator', _TreeGenerator2.default).controller('TreeViewController', _TreeViewController2.default);

exports.default = _module.name;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = TreeGenerator;

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

TreeGenerator.$inject = ['$compile'];

function TreeGenerator($compile) {
    var service = {};

    service.generate = function (nodes, params) {
        var html = generateHtml(nodes, params.maxDepth, params);

        return $compile(html)(params.scope);
    };

    /**
     * Checks if should render further nodes of a tree depending upon the value of maxDepth.
     *
     * If maxDepth is not provided (undefined) then it implies it should render all nodes i.e discard max depth,
     * if maxDepth is provided and is a number it checks if max depth is greater than zero for rendering child nodes.
     *
     * @param maxDepth
     * @returns {boolean}
     */
    function shouldGoDeeper(maxDepth) {
        return maxDepth === undefined || !isNaN(maxDepth) && maxDepth >= 0;
    }

    function generateHtml(nodes, maxDepth, params) {
        if (!_angular2.default.isArray(nodes) || nodes.length === 0 || !shouldGoDeeper(maxDepth)) {
            return '';
        }

        // Get the list items html
        var listItems = nodes.map(function (node, index) {
            return getListItem(node, index, {
                maxDepth: maxDepth,
                isCheckboxEnabled: params.isCheckboxEnabled
            });
        });

        return '<ul class="tree-view collapsible">' + listItems.join('') + '</ul>';
    }

    function getToggleLinkHtml(nodeExpr) {
        var isCollapsed = nodeExpr + '.collapsed';
        var isNotCollapsed = '!' + isCollapsed;

        return '<a class="toggle" ng-click="vm.toggleNode(' + nodeExpr + ', $event)" ng-if="vm.hasChildren(' + nodeExpr + ')">' + ('<i class="fa fa-w fa-chevron-right" ng-show="' + isCollapsed + '"></i>') + ('<i class="fa fa-w fa-chevron-down" ng-show="' + isNotCollapsed + '"></i>') + '</a>';
    }

    function getLabelWithCheckbox(nodeExpr) {
        var isSelected = nodeExpr + '.selected';
        var name = '{{' + nodeExpr + '.name}}';

        return '<label>' + ('<input type="checkbox" ng-model="' + isSelected + '" ng-change="vm.handleChange(' + nodeExpr + ')"> ') + ('<span>' + name + '</span>') + '</label>';
    }

    function getLabel(nodeExpr) {
        var name = '{{' + nodeExpr + '.name}}';

        return '<span class="label">' + name + '</span>';
    }

    function getListItem(node, index, params) {
        var maxDepth = params.maxDepth;
        var nodeExpr = 'vm.flatNodes[' + node.id + ']';
        var isCollapsed = nodeExpr + '.collapsed';
        var isNotCollapsed = '!' + isCollapsed;
        var label = params.isCheckboxEnabled ? getLabelWithCheckbox(nodeExpr) : getLabel(nodeExpr);

        node.collapsed = maxDepth === 0;
        // Decrement maxDepth for recursive calls
        maxDepth = isNaN(maxDepth) ? undefined : maxDepth - 1;

        return '<li class="tree-node" data-index="' + index + '" data-id="' + node.id + '"' + (' ng-class="{parent: vm.hasChildren(' + nodeExpr + '), collapsed: ' + isCollapsed + ', expanded: ' + isNotCollapsed + '}">') + getToggleLinkHtml(nodeExpr) + label + generateHtml(node.children, maxDepth, params) + '</li>';
    }

    return service;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = TreeView;

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

// TODO: Convert this to a simple javascript util module that exports some helper tree view methods
function TreeView() {
    var service = {};

    service.hasChildren = hasChildren;

    /**
     * Walks through each node of the tree and applies the callback to each node walked.
     *
     * @param tree
     * @param callback
     */
    service.walk = function (tree, callback) {
        if (!Array.isArray(tree)) {
            tree = [tree];
        }

        tree.forEach(function (node, index) {
            callback(node, index);

            if (hasChildren(node)) {
                service.walk(node.children, callback);
            }
        });
    };

    /**
     * Filters the tree recursively depending upon the boolean value returned by the callback
     * for each node.
     *
     * @param tree
     * @param callback
     * @param inclusiveChildren
     */
    service.filter = function (tree, callback, inclusiveChildren) {
        // If the tree is not an array make it an array
        if (!_angular2.default.isArray(tree)) {
            return service.filter([tree], callback, inclusiveChildren);
        }

        // Whether or not to include the child nodes even if their parent nodes aren't included.
        if (inclusiveChildren === true) {
            return filterTreeInclusive(tree, callback);
        }

        return filterTree(tree, callback);
    };

    /**
     * Flattens the tree into a linear object with node id as it's keys.
     *
     * @param tree
     * @returns {{}}
     */
    service.flattenAsObject = function (tree) {
        var object = {};

        service.walk(tree, function (node) {
            object[node.id] = node;
        });

        return object;
    };

    /**
     * Results a new array (immutable) obtained by applying the callback function to
     * each node of the tree recursively.
     *
     * @param tree
     * @param callback
     */
    service.map = function (tree, callback) {
        // If the tree is not an array make it an array
        if (!_angular2.default.isArray(tree)) {
            return service.map([tree], callback);
        }

        return mapTree(tree, callback);
    };

    /**
     * Counts the number of nodes a tree has.
     *
     * @param tree
     * @returns {number}
     */
    service.count = function count(tree) {
        tree = _angular2.default.isArray(tree) ? tree : [tree];

        return tree.reduce(function (acc, node) {
            var childTreeCount = hasChildren(node) ? count(node.children) : 0;

            return acc + childTreeCount;
        }, tree.length);
    };

    /**
     * The actual implementation of the recursive map() function for trees.
     *
     * @param tree
     * @param callback
     * @returns {Array}
     */
    function mapTree(tree, callback) {
        return tree.map(function (node, index) {
            var mappedNode = callback(node, index);

            // If the node has children then map them as well.
            if (_angular2.default.isArray(node.children)) {
                mappedNode.children = mapTree(node.children, callback);
            }

            return mappedNode;
        });
    }

    /**
     * Filter and return a new tree such that the nodes for which the callback
     * returns false would be skipped along with all of their child nodes.
     *
     * @param tree
     * @param callback
     * @returns {Array}
     */
    function filterTree(tree, callback) {
        var result = [];

        if (!_angular2.default.isArray(tree)) {
            return [];
        }

        for (var index = 0; index < tree.length; index++) {
            var node = tree[index];
            var shouldIncludeIt = callback(node, index);

            // If the condition holds false for a single node
            // ignore the whole tree of that node (including all it's children).
            if (!shouldIncludeIt) {
                continue;
            }

            node.children = filterTree(node.children, callback);
            result.push(node);
        }

        return result;
    }

    /**
     * Filter and return a new tree such that the nodes for which the callback returns false
     * would be skipped but their children might be added to the new tree if the callback returns true
     * for those.
     * Note: The tree structure might change for this, as the children nodes could climb up the hierarchy
     * in case their parents aren't included.
     *
     * @param tree
     * @param callback
     */
    function filterTreeInclusive(tree, callback) {
        var result = [];

        if (!_angular2.default.isArray(tree)) {
            return [];
        }

        for (var index = 0; index < tree.length; index++) {
            var node = tree[index];
            var shouldIncludeIt = callback(node, index);
            var filteredChildren = filterTreeInclusive(node.children, callback);

            if (shouldIncludeIt) {
                // If the condition holds true then include the node
                // along with it's filtered children.
                node.children = filteredChildren;
                result.push(node);
            } else {
                // Otherwise, just add the filtered children to the resulting filtered tree.
                result = result.concat(filteredChildren);
            }
        }

        return result;
    }

    /**
     * Checks if a node has child nodes.
     *
     * @param node
     * @returns {boolean}
     */
    function hasChildren(node) {
        return _angular2.default.isArray(node.children) && node.children.length > 0;
    }

    return service;
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = TreeViewController;

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

TreeViewController.$inject = ['$scope', '$timeout', '$element', '$compile', 'TreeView', 'TreeGenerator'];

function TreeViewController($scope, $timeout, $element, $compile, TreeView, TreeGenerator) {
    var vm = this;

    vm.maxDepth = Number(vm.maxDepth) || 0;
    vm.hasChildren = TreeView.hasChildren;
    vm.flatNodes = {};
    vm.isCheckboxEnabled = function () {
        return vm.checkboxes === 'true';
    };

    vm.toggleNode = function (node, $event) {
        var clickedElement = $event.currentTarget;
        var nodeElement = _angular2.default.element(clickedElement).closest('li.tree-node');
        var containsChildTree = nodeElement.find('ul.tree-view').length > 0;

        // If the node's child tree hasn't been added to the DOM
        // add it first.
        if (TreeView.hasChildren(node) && !containsChildTree) {
            var childTree = generateTree(node.children, 0);

            nodeElement.append(childTree);
        }

        node.collapsed = !node.collapsed;
    };

    vm.handleChange = function (node) {
        if (_angular2.default.isFunction(vm.onSelectionChange)) {
            vm.onSelectionChange(node);
        }
    };

    function init() {
        $scope.vm = vm;
        vm.flatNodes = TreeView.flattenAsObject(vm.nodes);
        $timeout(render);
    }

    function render() {
        var tree = generateTree(vm.nodes, vm.maxDepth);

        $element.html(tree);
    }

    function generateTree(nodes, maxDepth) {
        return TreeGenerator.generate(nodes, {
            maxDepth: maxDepth,
            scope: $scope,
            isCheckboxEnabled: vm.isCheckboxEnabled()
        });
    }

    init();
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = treeView;
function treeView() {
    return {
        restrict: 'E',
        scope: {
            nodes: '=',
            maxDepth: '@',
            checkboxes: '@',
            onSelectionChange: '='
        },
        replace: true,
        template: '',
        controller: 'TreeViewController',
        controllerAs: 'vm',
        bindToController: true
    };
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(1).default;

/***/ })
/******/ ]);
//# sourceMappingURL=ng-tree-view.js.map