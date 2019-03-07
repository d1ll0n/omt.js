"use strict";
exports.__esModule = true;
var types_1 = require("./types");
var math_1 = require("./math");
exports.nodeDistance = function (y, root) {
    return math_1.distance(y, (root.maxKey || root.key));
};
exports.minKey = function (x, y) {
    return math_1.min((x.maxKey || x.key), (y.maxKey || y.key));
};
exports.maxKey = function (x, y) {
    return math_1.max((x.maxKey || x.key), (y.maxKey || y.key));
};
function insert(root, k, v) {
    if (root instanceof types_1.BranchNode)
        return branchInsert(root, k, v);
    else
        return leafInsert(root, k, v);
}
exports.insert = insert;
function leafInsert(leaf, k, v) {
    var key = leaf.key;
    var newLeaf = new types_1.LeafNode(k, v);
    if (k == key)
        throw new Error('key already exists');
    if (k > key)
        return new types_1.BranchNode(leaf, newLeaf);
    return new types_1.BranchNode(newLeaf, leaf);
}
/*
We want to minimize the travel path for nodes in the tree,
so when inserting a new key, if the key is greater than
the old maximum or less than the old minimum, we check
if the distance between the old maximum of the left side
and the old minimum of the right side is greater than the
distance between the old maximum or minimum and the new key
If the distance is greater, we create a new branch at that level
with the old root branch on the left or right side of the new entry

If a key is within the range of a branch, it will be inserted into that branch
If it is outside the range of the branch, it will either be inserted into the branch
on the right or into the current level depending on the relative distances between the
local maxima and minima and the previous maxima and minima

Ex. 1 We have a branch with nodes 1,2 and we insert 4
since (4-2) > (2-1) 4 will go on the right and [1,2] will go on the left

Ex. 2 We have a branch with nodes 1,4 and we insert 3
since 4<3 we check the distance of |4-3| and |1-3|
3 is closer to 4, so [3,4] goes on the right and 1 goes on the left

Ex. 3 We have a branch with nodes [[1,2], [5,8]] and we insert 3
4 is equidistant from 3 and 5, so it goes on the left


*/
function branchInsert(root, k, v) {
    var left = root.left;
    var right = root.right;
    var newNode = new types_1.LeafNode(k, v);
    var oldDist = math_1.distance(left.maxKey || left.key, right.minKey || right.key);
    var rightDist, leftDist;
    if (k > (right.maxKey || right.key)) {
        // key is greater than local maxima
        rightDist = math_1.distance((right.maxKey || right.key), k);
        if (rightDist > oldDist)
            return new types_1.BranchNode(root, newNode);
        else {
            right = insert(right, k, v);
            return new types_1.BranchNode(left, right);
        }
    }
    if (k < (left.minKey || left.key)) {
        // key is less than local minima
        leftDist = math_1.distance((left.minKey || left.key), k);
        if (leftDist > oldDist)
            return new types_1.BranchNode(newNode, root);
        else {
            left = insert(left, k, v);
            return new types_1.BranchNode(left, right);
        }
    }
    if (k < (left.maxKey || left.key)) {
        // key belongs on the left
        left = insert(left, k, v);
        return new types_1.BranchNode(left, right);
    }
    if (k > (right.minKey || right.key)) {
        // key belongs on the right
        right = insert(right, k, v);
        return new types_1.BranchNode(left, right);
    }
    if (k < (right.minKey || right.key) && k > (left.maxKey || left.key)) {
        // key is between the left maximum and right minimum
        rightDist = math_1.distance((right.minKey || right.key), k);
        leftDist = math_1.distance((left.maxKey || left.key), k);
        if (leftDist < rightDist) {
            left = insert(left, k, v);
            return new types_1.BranchNode(left, right);
        }
        else {
            right = insert(right, k, v);
            return new types_1.BranchNode(left, right);
        }
    }
}
function minInSubTree(node) {
    if (node instanceof types_1.BranchNode)
        return minInSubTree(node.left);
    else
        return node.key;
}
function maxInSubTree(node) {
    if (node instanceof types_1.BranchNode)
        return maxInSubTree(node.right);
    else
        return node.key;
}
function membershipProof(root, k, sibling) {
    // console.log(`building membership proof for key ${k}, current root: ${root.maxKey || root.key} current sibling: ${sibling && (sibling.maxKey || sibling.key)}`)
    var left = root.left;
    var right = root.right;
    var result;
    // check if we are at the node
    if (left instanceof types_1.LeafNode && left.key == k) {
        result = new types_1.MembershipProof(left, right);
    }
    else if (right instanceof types_1.LeafNode && right.key == k) {
        result = new types_1.MembershipProof(right, left);
    }
    else if (k <= (left.maxKey || left.key)) {
        result = membershipProof(left, k, right);
    }
    else {
        result = membershipProof(right, k, left);
    }
    if (sibling)
        result.addSibling(sibling);
    else
        result.root = root.hash;
    return result;
}
exports.membershipProof = membershipProof;
function getHash(node) {
    if (node instanceof types_1.ProofNode_Branch) {
        return math_1.hashOf(JSON.stringify({
            left: node.left,
            right: node.right,
            maxKey: node.maxKey,
            minKey: node.minKey
        }));
    }
    else
        return math_1.hashOf(JSON.stringify({
            key: node.key,
            hash: node.hash
        }));
}
function verifyProof(proof) {
    console.log("verifying merkle proof for root hash " + proof.root + " with " + proof.siblings.length + " siblings");
    var hash = proof.node.hash;
    var min = proof.node.key;
    var max = proof.node.key;
    console.log(hash);
    for (var _i = 0, _a = proof.siblings; _i < _a.length; _i++) {
        var node = _a[_i];
        var thisMax = node.key || node.maxKey;
        var thisMin = node.key || node.minKey;
        var thisHash = getHash(node);
        console.log("key: " + node.key + " hash: " + thisHash);
        var left = void 0, right = void 0;
        if (thisMin > max) {
            left = hash;
            right = thisHash;
        }
        else {
            left = thisHash;
            right = hash;
        }
        if (thisMax > max)
            max = thisMax;
        if (thisMin < min)
            min = thisMin;
        hash = math_1.hashOf(JSON.stringify({
            left: left,
            right: right,
            maxKey: max,
            minKey: min
        }));
        console.log({
            left: left,
            right: right,
            maxKey: max,
            minKey: min,
            hash: hash
        });
    }
    console.log(hash);
}
exports.verifyProof = verifyProof;
