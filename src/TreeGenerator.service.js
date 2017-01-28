import angular from 'angular';

TreeGenerator.$inject = ['$compile'];

export default function TreeGenerator($compile) {
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
        return (
            maxDepth === undefined ||
            (!isNaN(maxDepth) && maxDepth >= 0)
        );
    }

    function generateHtml(nodes, maxDepth, params) {
        if (!angular.isArray(nodes) || nodes.length === 0 || !shouldGoDeeper(maxDepth)) {
            return '';
        }

        var html = '<ul class="tree-view collapsible">';

        for (var index = 0; index < nodes.length; index++) {
            var node = nodes[index];

            html += getListItem(node, index, {
                maxDepth: maxDepth,
                isCheckboxEnabled: params.isCheckboxEnabled
            });
        }

        html += '</ul>';

        return html;
    }

    function getToggleLinkHtml(nodeExpr) {
        var isCollapsed = nodeExpr + '.collapsed';
        var isNotCollapsed = '!' + isCollapsed;

        return (
            '<a class="toggle" ng-click="vm.toggleNode(' + nodeExpr + ', $event)" ng-if="vm.hasChildren(' + nodeExpr + ')">' +
            '<i class="fa fa-w fa-chevron-right" ng-show="' + isCollapsed + '"></i>' +
            '<i class="fa fa-w fa-chevron-down" ng-show="' + isNotCollapsed + '"></i>' +
            '</a>'
        );
    }

    function getLabelWithCheckbox(nodeExpr) {
        var isSelected = nodeExpr + '.selected';
        var name = '{{' + nodeExpr + '.name}}';

        return (
            '<label>' +
            '<input type="checkbox" ng-model="' + isSelected + '" ng-change="vm.handleChange(' + nodeExpr + ')"> ' +
            '<span>' + name + '</span>' +
            '</label>'
        );
    }

    function getLabel(nodeExpr) {
        var name = '{{' + nodeExpr + '.name}}';

        return '<span class="label">' + name + '</span>';
    }

    function getListItem(node, index, params) {
        var maxDepth = params.maxDepth;
        var nodeExpr = 'vm.flatNodes[' + node.id + ']';
        var label = params.isCheckboxEnabled ? getLabelWithCheckbox(nodeExpr) : getLabel(nodeExpr);

        node.collapsed = (maxDepth === 0);
        // Decrement maxDepth for recursive calls
        maxDepth = isNaN(maxDepth) ? undefined : maxDepth - 1;

        return (
            '<li class="tree-node" data-index="' + index + '" data-id="' + node.id + '"' +
            ' ng-class="{parent: vm.hasChildren(' + nodeExpr + '), collapsed: ' + nodeExpr + '.collapsed,' +
            ' expanded: !' + nodeExpr + '.collapsed}">' +

            getToggleLinkHtml(nodeExpr) + label +
            generateHtml(node.children, maxDepth, params) +
            '</li>'
        );
    }

    return service;
}

