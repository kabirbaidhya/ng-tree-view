export default function treeView() {
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
