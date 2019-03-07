import { membershipProof, insert, verifyProof } from './lib'
import { LeafNode, BranchNode } from './types'

const l1 = new LeafNode(1, 'hello!')
const l2 = new LeafNode(4, 'hi!')

let root = new BranchNode(l1, l2)
root = insert(root, 3, 'hello')
root = insert(root, 5, 'hello')
root = insert(root, 7, 'hellofriend')
root = insert(root, 9, 'hellofriend1')
root = insert(root, 8, 'hellofriend1')
console.log(root.right.left)
const proof = membershipProof(root, 5)
console.log(proof)
verifyProof(proof)
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