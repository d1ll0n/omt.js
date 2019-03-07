"use strict";
exports.__esModule = true;
var math_1 = require("./math");
var BranchNode = /** @class */ (function () {
    function BranchNode(left, right) {
        this.left = left;
        this.right = right;
        this.maxKey = math_1.max(right.maxKey || right.key);
        this.minKey = math_1.min(left.minKey || left.key);
        this.hash = math_1.hashOf(JSON.stringify({
            left: left.hash,
            right: right.hash,
            maxKey: this.maxKey,
            minKey: this.minKey
        }));
    }
    return BranchNode;
}());
exports.BranchNode = BranchNode;
/*
The hash of the leaf node is the hash of (key, hash(value))
This allows us to verify locations of leaves when doing merkle proofs
while only providing values of hashes, rather than the full values
*/
var LeafNode = /** @class */ (function () {
    function LeafNode(k, v) {
        this.key = k;
        this.value = v;
        this.hash = math_1.hashOf(JSON.stringify({
            key: k,
            hash: math_1.hashOf(v)
        }));
    }
    return LeafNode;
}());
exports.LeafNode = LeafNode;
var ProofNode_Branch = /** @class */ (function () {
    function ProofNode_Branch(node) {
        this.maxKey = node.maxKey;
        this.minKey = node.minKey;
        this.left = node.left.hash;
        this.right = node.right.hash;
    }
    return ProofNode_Branch;
}());
exports.ProofNode_Branch = ProofNode_Branch;
var ProofNode_Leaf = /** @class */ (function () {
    function ProofNode_Leaf(node) {
        this.key = node.key;
        this.hash = math_1.hashOf(node.value);
    }
    return ProofNode_Leaf;
}());
exports.ProofNode_Leaf = ProofNode_Leaf;
var MembershipProof = /** @class */ (function () {
    function MembershipProof(node, sibling) {
        this.siblings = [];
        this.node = node;
        this.addSibling(sibling);
    }
    MembershipProof.prototype.addSibling = function (node) {
        var sibling;
        // used two ifs instead of a ternary to remove compile warnings
        if (node instanceof BranchNode)
            sibling = new ProofNode_Branch(node);
        if (node instanceof LeafNode)
            sibling = new ProofNode_Leaf(node);
        this.siblings.push(sibling);
    };
    return MembershipProof;
}());
exports.MembershipProof = MembershipProof;
