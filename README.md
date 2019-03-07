
# omt.js
TypeScript & JavaScript implementation of ordered merkle trees.

[Based on the specification for compact sparse merkle trees by Faraz Haider](https://eprint.iacr.org/2018/955.pdf).

This is an implementation of ordered merkle trees where the ordered property of the tree is verified in merkle proofs by providing keys as part of the proof and using keys+values in the merkle hashes.

