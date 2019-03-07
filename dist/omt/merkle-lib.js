"use strict";
exports.__esModule = true;
var types_1 = require("../lib/types");
var math_1 = require("../lib/math");
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
function branchInsert(root, k, v) {
    var left = root.left;
    var right = root.right;
    var newNode = new types_1.LeafNode(k, v);
    var oldDist = math_1.distance(left.maxKey || left.key, right.minKey || right.key);
    var rightDist, leftDist;
    if (k > (right.maxKey || right.key)) {
        rightDist = math_1.distance((right.maxKey || right.key), k);
        if (rightDist > oldDist)
            return new types_1.BranchNode(root, newNode);
        else {
            right = insert(right, k, v);
            return new types_1.BranchNode(left, right);
        }
    }
    if (k < (left.minKey || left.key)) {
        leftDist = math_1.distance((left.minKey || left.key), k);
        if (leftDist > oldDist)
            return new types_1.BranchNode(newNode, root);
        else {
            left = insert(left, k, v);
            return new types_1.BranchNode(left, right);
        }
    }
    if (k < (left.maxKey || left.key)) {
        left = insert(left, k, v);
        return new types_1.BranchNode(left, right);
    }
    if (k > (right.minKey || right.key)) {
        right = insert(right, k, v);
        return new types_1.BranchNode(left, right);
    }
    if (k < (right.minKey || right.key) && k > (left.maxKey || left.key)) {
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
    var left = root.left;
    var right = root.right;
    var result;
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
    var hash = proof.node.hash;
    var min = proof.node.key;
    var max = proof.node.key;
    for (var _i = 0, _a = proof.siblings; _i < _a.length; _i++) {
        var node = _a[_i];
        var thisMax = node.key || node.maxKey;
        var thisMin = node.key || node.minKey;
        var thisHash = getHash(node);
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
    }
    return hash == proof.root;
}
exports.verifyProof = verifyProof;
