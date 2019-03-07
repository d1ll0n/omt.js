import { TreeNode, LeafNode, BranchNode, MembershipProof, ProofNode, ProofNode_Branch } from '../lib/types'
import { distance, min, max, hashOf } from '../lib/math'

export function insert(root: TreeNode, k: number, v: string) {
  if (root instanceof BranchNode) return branchInsert(root, k, v)
  else return leafInsert(root, k, v)
}

function leafInsert(leaf: TreeNode, k: number, v: string): BranchNode {
  const { key } = leaf
  const newLeaf = new LeafNode(k, v)
  if (k == key) throw new Error('key already exists')
  if (k > key) return new BranchNode(leaf, newLeaf)
  return new BranchNode(newLeaf, leaf)
}

/*
If a key is within the range of a branch, it will be inserted into that branch
If it is outside the range of the branch, it will either be inserted into the branch
on the right or into the current level depending on the relative distances between the
local maxima and minima and the previous maxima and minima

Ex. 1 We have a branch with nodes 1,2 and we insert 4
since (4-2) > (2-1) 4 will go on the right and [1,2] will go on the left

Ex. 2 We have a branch with nodes 1,4 and we insert 3
since 4>3 we check the distance of |4-3| and |1-3|
3 is closer to 4, so [3,4] goes on the right and 1 goes on the left

*/
function branchInsert(root: BranchNode, k: number, v: string): BranchNode {
  let left = root.left;
  let right = root.right;
  const newNode = new LeafNode(k, v)
  const oldDist = distance(left.maxKey || left.key, right.minKey || right.key)
  let rightDist, leftDist

  if (k > (right.maxKey || right.key)) {
    // key is greater than local maxima
    rightDist = distance((right.maxKey || right.key), k)
    if (rightDist > oldDist) return new BranchNode(root, newNode)
    else {
      right = insert(right, k, v)
      return new BranchNode(left, right)
    }
  }
  if (k < (left.minKey || left.key)) {
    // key is less than local minima
    leftDist = distance((left.minKey || left.key), k)
    if (leftDist > oldDist) return new BranchNode(newNode, root)
    else {
      left = insert(left, k, v)
      return new BranchNode(left, right)
    }
  }

  if (k < (left.maxKey || left.key)) {
    // key belongs on the left
    left = insert(left, k, v)
    return new BranchNode(left, right)
  }

  if (k > (right.minKey || right.key)) {
    // key belongs on the right
    right = insert(right, k, v)
    return new BranchNode(left, right)
  }

  if (k < (right.minKey || right.key) && k > (left.maxKey || left.key)) {
    // key is between the left maximum and right minimum
    rightDist = distance((right.minKey || right.key), k)
    leftDist = distance((left.maxKey || left.key), k)
    if (leftDist < rightDist) {
      left = insert(left, k, v)
      return new BranchNode(left, right)
    }
    else {
      right = insert(right, k, v)
      return new BranchNode(left, right)
    }
  }
}

function minInSubTree(node: TreeNode) {
  if (node instanceof BranchNode) return minInSubTree(node.left)
  else return node.key
}

function maxInSubTree(node: TreeNode) {
  if (node instanceof BranchNode) return maxInSubTree(node.right)
  else return node.key
}

export function membershipProof(root: TreeNode, k: number, sibling?: TreeNode): MembershipProof {
  // console.log(`building membership proof for key ${k}, current root: ${root.maxKey || root.key} current sibling: ${sibling && (sibling.maxKey || sibling.key)}`)
  
  let left = root.left;
  let right = root.right;
  let result: MembershipProof
  // check if we are at the node
  if (left instanceof LeafNode && left.key == k) {
    result = new MembershipProof(left, right)
  }
  else if (right instanceof LeafNode && right.key == k) {
    result = new MembershipProof(right, left)
  }
  else if (k <= (left.maxKey || left.key)) {
    result = membershipProof(left, k, right)
  }
  else {
    result = membershipProof(right, k, left)
  }
  if (sibling) result.addSibling(sibling)
  else result.root = root.hash
  return result
}

function getHash(node: ProofNode) {
  if (node instanceof ProofNode_Branch) {
    return hashOf(JSON.stringify({
      left: node.left,
      right: node.right,
      maxKey: node.maxKey,
      minKey: node.minKey
    }))
  }
  else return hashOf(JSON.stringify({
    key: node.key,
    hash: node.hash
  }))
}

export function verifyProof(proof: MembershipProof) {
  let hash = proof.node.hash
  let min = proof.node.key
  let max = proof.node.key
  for (let node of proof.siblings) {
    let thisMax = node.key || node.maxKey
    let thisMin = node.key || node.minKey
    let thisHash = getHash(node)
    let left, right
    if (thisMin > max) {
      left = hash
      right = thisHash
    } else {
      left = thisHash
      right = hash
    }
    if (thisMax > max) max = thisMax
    if (thisMin < min) min = thisMin
    
    hash = hashOf(JSON.stringify({
      left,
      right,
      maxKey: max,
      minKey: min
    }))
  }
  return hash == proof.root
}