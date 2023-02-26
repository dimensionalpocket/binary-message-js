import { BinaryMessage } from '../../src/BinaryMessage.js'
import { Uint32 } from '../../src/descriptors/Uint32.js'

export class TestMessage extends BinaryMessage {
  constructor () {
    super({
      code: { type: Uint32 }
    })

    // HACKY JSDOC ANNOTATIONS

    /** @type {number} */
    this.code
  }
}
