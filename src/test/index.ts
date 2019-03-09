import 'mocha'
import * as chai from 'chai'

import { OrderedMerkleTree as OMT, verifyProof } from '../omt'

const dbPath = './merkledatabase'
const dbPath2 = './merkledatabase2'
const dbPath3 = './merkledatabase3'
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
    const omt = new OMT(dbPath)
    await omt.insertMany(defaultLeaves)
    const value1 = await omt.get(1)
    const value2 = await omt.get(500)
    chai.expect(value1).to.eql('hello world!')
    chai.expect(value2).to.eql('wow cool tree guy!')
    omt.db.close()
  })

  it('should prove an entry', async () => {
    const omt = new OMT(dbPath)
    await omt.insertMany(defaultLeaves)
    const proof = verifyProof(omt.proof(15))
    chai.expect(proof).to.eql(true)
    omt.db.close()
  })

  it('should update a value', async () => {
    const omt = new OMT(dbPath)
    await omt.insertMany(defaultLeaves)
    await omt.update(30, "hello")
    const updated = await omt.get(30)
    chai.expect(updated).to.eql("hello")
    const proof = omt.proof(30)
    chai.expect(proof.node.value).to.eql('hello')
    chai.expect(verifyProof(proof)).to.eql(true)
    omt.db.close()
  })

  it('should falsify a modified proof', async () => {
    const omt = new OMT(dbPath)
    await omt.insertMany(defaultLeaves)
    await omt.update(30, "hello")
    const updated = await omt.get(30)
    chai.expect(updated).to.eql("hello")
    const proof = omt.proof(30)
    proof.node.value = 'bad proof node'
    chai.expect(verifyProof(proof)).to.eql(false)
    omt.db.close()
  })
})