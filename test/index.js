import { expect } from '@dimensionalpocket/development'
import { BinaryMessage } from '../index.js'
import { BinaryMessage as BinaryMessageFromSrc } from '../src/BinaryMessage.js'

describe('main require', function () {
  it('exports BinaryMessage from src', function () {
    expect(BinaryMessage).to.equal(BinaryMessageFromSrc)
  })
})
