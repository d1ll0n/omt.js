
# csmt.js
TypeScript & JavaScript implementation of compact sparse merkle trees.

[Based on the specification for compact sparse merkle trees by Faraz Haider](https://eprint.iacr.org/2018/955.pdf), with a slight divergence in that we provide the full data for each node in proofs in order to provide proofs of correct location in the tree. Without this, it would be trivial to provide two values for the same key and give clients (or whoever) valid merkle proofs of otherwise invalid entries.

