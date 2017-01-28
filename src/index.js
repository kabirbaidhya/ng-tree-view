import angular from 'angular';
import treeView from './treeView.directive';
import TreeView from './TreeView.service';
import TreeGenerator from './TreeGenerator.service';
import TreeViewController from './TreeViewController';

let module = angular.module('ngTreeView', []);

module
    .directive('treeView', treeView)
    .factory('TreeView', TreeView)
    .factory('TreeGenerator', TreeGenerator)
    .controller('TreeViewController', TreeViewController);

export default module.name;