# Ng Tree View
[![NPM Version](https://img.shields.io/npm/v/ng-tree-view.svg?style=flat-square)](https://www.npmjs.com/package/ng-tree-view)
[![NPM Downloads](https://img.shields.io/npm/dt/ng-tree-view.svg?style=flat-square)](https://www.npmjs.com/package/ng-tree-view)

A lightweight promise based package to load scripts on the fly.

## Installation

```bash
# Using npm
$ npm install ng-tree-view --save

# Using Yarn
$ yarn add ng-tree-view

# Using Bower
$ bower install ng-tree-view --save
```

## Usage

Require the angular module using
```javascript
var ngTreeView = require('ng-tree-view'); 
```
Or
```html
<script type="text/javascript" src="/path/to/ng-tree-view/dist/ng-tree-view.min.js"></script>
```
Then you should be able to use it as simply as this:
```javascript

// Add the module as a dependeny in your app
angular.module('app', ['ngTreeView']);

// Pass the tree data from your controller.
angular.module('app')
    .controller('MyController', [
        '$scope', 
        function($scope) {
            $scope.treeNodes = [
                ...
            ];
        }
    ]);
```

Now use the `tree-view` directive like this.
```
<tree-view nodes="treeNodes" max-depth="5"></tree-view>
```