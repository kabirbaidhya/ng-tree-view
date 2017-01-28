import angular from 'angular';

TreeViewController.$inject = ['$scope', '$timeout', '$element', '$compile', 'TreeView', 'TreeGenerator'];

export default function TreeViewController($scope, $timeout, $element, $compile, TreeView, TreeGenerator) {
    var vm = this;

    vm.maxDepth = Number(vm.maxDepth) || 0;
    vm.hasChildren = TreeView.hasChildren;
    vm.flatNodes = {};
    vm.isCheckboxEnabled = function () {
        return vm.checkboxes === 'true';
    };

    vm.toggleNode = function (node, $event) {
        var clickedElement = $event.currentTarget;
        var nodeElement = angular.element(clickedElement).closest('li.tree-node');
        var containsChildTree = (nodeElement.find('ul.tree-view').length > 0);

        // If the node's child tree hasn't been added to the DOM
        // add it first.
        if (TreeView.hasChildren(node) && !containsChildTree) {
            var childTree = generateTree(node.children, 0);

            nodeElement.append(childTree);
        }

        node.collapsed = !node.collapsed;
    };

    vm.handleChange = function (node) {
        if (angular.isFunction(vm.onSelectionChange)) {
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

