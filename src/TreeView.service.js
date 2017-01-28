import angular from 'angular';

// TODO: Convert this to a simple javascript util module that exports some helper tree view methods
export default function TreeView() {
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
        if (!angular.isArray(tree)) {
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
        if (!angular.isArray(tree)) {
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
        tree = angular.isArray(tree) ? tree : [tree];

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
            if (angular.isArray(node.children)) {
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

        if (!angular.isArray(tree)) {
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

        if (!angular.isArray(tree)) {
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
        return (angular.isArray(node.children) && node.children.length > 0);
    }

    return service;
}

