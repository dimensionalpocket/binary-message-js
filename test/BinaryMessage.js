import { expect } from '@dimensionalpocket/development'
import { TestMessage } from './support/TestMessage.js'

describe('BinaryMessage', function () {
  describe('constructor', function () {
    describe('defaults', function () {
      before(function () {
        this.message = new TestMessage()
        this.message.code = 123
      })

      it('initializes properties from given schema', function () {
        expect(this.message.code).to.eq(123)
      })

      it('initializes a buffer', function () {
        const array = new Uint32Array(this.message.buffer)
        expect(array[0]).to.eq(123)
      })
    })
  })
})

/**
 * @name TestMessage#code
 * @memberof TestMessage
 */
