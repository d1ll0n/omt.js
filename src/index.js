"use strict";
exports.__esModule = true;
var lib_1 = require("./lib");
var types_1 = require("./types");
var l1 = new types_1.LeafNode(1, 'hello!');
var l2 = new types_1.LeafNode(4, 'hi!');
var root = new types_1.BranchNode(l1, l2);
root = lib_1.insert(root, 3, 'hello');
root = lib_1.insert(root, 5, 'hello');
root = lib_1.insert(root, 7, 'hellofriend');
root = lib_1.insert(root, 9, 'hellofriend1');
root = lib_1.insert(root, 8, 'hellofriend1');
console.log(root.right.left);
var proof = lib_1.membershipProof(root, 5);
console.log(proof);
lib_1.verifyProof(proof);
/*
const l1 = new LeafNode(1, 'hello!')
const l2 = new LeafNode(3, 'hi!')
let root = new BranchNode(l1, l2)
root = insert(root, 5, 'hello')
root = insert(root, 7, 'hellofriend')
root = insert(root, 3, 'hellofriend1')
root = insert(root, 9, 'hellofriend1')
root = insert(root, 8, 'hellofriend1')
console.log(root)
root = insert(root, 75, 'hellofriend1')
console.log(root)
root = insert(root, 8, 'hellofriend1')
root = insert(root, 4, 'hellofriend1')
const proof = membershipProof(root, 5)
console.log(proof)
*/ 
