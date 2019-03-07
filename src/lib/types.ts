import { Keccak } from 'sha3'
import { hashOf, max, min } from './math'


export interface TreeNode {
  left?: TreeNode;
  right?: TreeNode;
  maxKey?: number;
  minKey?: number;
  key?: number;
  value?: string;
  hash: string;
}

export class BranchNode {
  hash: string;
  maxKey: number;
  minKey: number;
  left: TreeNode;
  right: TreeNode;

  constructor(left: TreeNode, right: TreeNode) {
    this.left = left;
    this.right = right;
    this.maxKey = max(right.maxKey || right.key)
    this.minKey = min(left.minKey || left.key)
    this.hash = hashOf(JSON.stringify({
      left: left.hash,
      right: right.hash,
      maxKey: this.maxKey,
      minKey: this.minKey
    }))
  }
}

/*
The hash of the leaf node is the hash of (key, hash(value))
This allows us to verify locations of leaves when doing merkle proofs
while only providing values of hashes, rather than the full values
*/

export class LeafNode {
  key: number;
  value: string;
  hash: string;
  
  constructor(k: number, v: string) {
    this.key = k;
    this.value = v;
    this.hash = hashOf(JSON.stringify({
      key: k,
      hash: hashOf(v)
    }))
  }
}

export interface ProofNode {
  left?: string;
  right?: string;
  key?: number;
  maxKey?: number;
  minKey?: number;
  hash?: string;
}

export class ProofNode_Branch {
  left: string;
  right: string;
  maxKey: number;
  minKey: number;

  constructor(node: BranchNode) {
    this.maxKey = node.maxKey
    this.minKey = node.minKey
    this.left = node.left.hash
    this.right = node.right.hash
  }
}

export class ProofNode_Leaf {
  key: number;
  hash: string;

  constructor(node: LeafNode) {
    this.key = node.key
    this.hash = hashOf(node.value)
  }
}

export class MembershipProof {
  node: LeafNode;
  siblings: ProofNode[] = [];
  root?: string;

  constructor(node: LeafNode, sibling: TreeNode) {
    this.node = node
    this.addSibling(sibling)
  }

  addSibling(node: TreeNode) {
    let sibling;
    // used two ifs instead of a ternary to remove compile warnings
    if (node instanceof BranchNode) sibling = new ProofNode_Branch(node)
    if (node instanceof LeafNode) sibling = new ProofNode_Leaf(node)
    this.siblings.push(sibling)
  }
}