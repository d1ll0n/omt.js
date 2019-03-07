import 'mocha'
import * as chai from 'chai'

import { OrderedMerkleTree as OMT, verifyProof } from '../omt'

const dbPath1 = './merkledatabase'
const dbPath2 = './merkledatabase2'
const defaultLeaves = [
  {
    key: 1,
    value: 'hello world!'
  },
  {
    key: 500,
    value: 'wow cool tree guy!'
  },
  {
    key: 30,
    value: 'gee I love cool stuff'
  },
  {
    key: 15,
    value: '4th time\'s the charm'
  }
]

chai.should()
describe('merkle proof tester', () => {
  it('should make some inserts', async () => {
    const omt = new OMT(dbPath1)
    await omt.insertMany(defaultLeaves)
    const value1 = await omt.get(1)
    const value2 = await omt.get(500)
    chai.expect(value1).to.eql('hello world!')
    chai.expect(value2).to.eql('wow cool tree guy!')
  })
  it('should prove an entry', async () => {
    const omt = new OMT(dbPath2)
    await omt.insertMany(defaultLeaves)
    const proof1 = verifyProof(omt.proof(30))
    const proof2 = verifyProof(omt.proof(15))
    chai.expect(proof1).to.eql(true)
    chai.expect(proof2).to.eql(true)
  })
})