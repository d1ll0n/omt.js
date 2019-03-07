import * as level from 'level'
import { membershipProof, insert } from './merkle-lib'
import { LeafNode, TreeNode } from '../lib/types'

export default class OrderedMerkleTree {
  root: TreeNode;
  db: any;

  constructor(db: any) {
    if (typeof(db) == 'string') this.db = level(db)
    else this.db = db
  }

  get(key: number) {
    return this.db.get(key)
  }

  proof(key: number) {
    return membershipProof(this.root, key)
  }

  insert(key: number, value: string) {
    this.root = !this.root ? new LeafNode(key, value) : insert(this.root, key, value)
    return this.db.put(key, value)
  }

  async insertMany(leaves: {key: number, value: string}[]) {
    for (let leaf of leaves) await this.insert(leaf.key, leaf.value)
  }
}