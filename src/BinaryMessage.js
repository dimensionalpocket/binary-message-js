const INTERNALS_BYTE_LENGTH = 0
const INTERNALS_BYTE_OFFSET = 1
const INTERNALS_STRIDE = 2
const INTERNALS_COUNT = 3

export class BinaryMessage {
  /**
   * @param {BinaryMessageSchema} schema
   * @param {object} [options]
   * @param {number} [options.byteLength] - The total size of the buffer for the entire message. If not provided, will auto-calculate based on schema.
   * @param {number} [options.byteOffset] - The number of bytes to skip from the start of the buffer. Defaults to zero.
   * @param {ArrayBuffer} [options.buffer] - If not provided, will create a buffer automatically with the correct size.
   */
  constructor (schema, options = undefined) {
    if (!schema) {
      throw new Error('BinaryMessage: schema is required')
    }

    const internals = new Uint32Array(INTERNALS_COUNT)
    internals[INTERNALS_BYTE_OFFSET] = options?.byteOffset || 0
    internals[INTERNALS_STRIDE] = internals[INTERNALS_BYTE_OFFSET]

    /**
     * Internal data for this message.
     * Not part of the buffer.
     *
     * @type {Uint32Array}
     */
    this.internals = internals

    /**
     * @private
     * The compiled schema.
     *
     * @type {BinaryMessageInternalSchema}
     */
    this._schema = {}
    var compiledSchema = this._schema

    for (let propertyName in schema) {
      let property = schema[propertyName]
      let descriptor = property.type
      if (!descriptor) {
        throw new Error(`Property ${propertyName} missing type`)
      }

      let propertyByteLength = descriptor.size
      let propertyByteOffset = this.setNextPropertyByteOffset(propertyByteLength)

      const compiledProperty = {
        descriptor: descriptor,
        byteLength: propertyByteLength,
        byteOffset: propertyByteOffset
      }

      compiledSchema[propertyName] = compiledProperty

      Object.defineProperty(this, propertyName, {
        /** @this {BinaryMessage} */
        get () { return descriptor.get(this.dataView, propertyByteOffset) },

        /** @this {BinaryMessage} */
        set (value) { descriptor.set(this.dataView, propertyByteOffset, value) },

        enumerable: true,
        configurable: false
      })
    }

    // Byte Length can only be calculated after all properties are added.
    internals[INTERNALS_BYTE_LENGTH] = options?.byteLength || internals[INTERNALS_STRIDE]

    /**
     * @private
     * @type {ArrayBuffer}
     */
    this._buffer = options?.buffer || new ArrayBuffer(this.byteLength)

    /**
     * @type {DataView}
     */
    this.dataView = new DataView(this._buffer, this.byteOffset)
  }

  get buffer () {
    return this._buffer
  }

  set buffer (buffer) {
    this._buffer = buffer
    this._setDataView()
  }

  get byteLength () {
    return this.internals[INTERNALS_BYTE_LENGTH]
  }

  get byteOffset () {
    return this.internals[INTERNALS_BYTE_OFFSET]
  }

  /**
   * This is used when adding new properties. It does two things:
   *
   * 1) Increments the internal stride by the new property's byte length;
   * 2) Returns the current stride, to be used by the new property.
   *
   * @param {number} byteLength - The length of the new property in bytes.
   * @returns {number} - The byte offset for the property being added.
   */
  setNextPropertyByteOffset (byteLength = 0) {
    const internals = this.internals
    const currentStride = internals[INTERNALS_STRIDE]
    internals[INTERNALS_STRIDE] += byteLength
    return currentStride
  }

  /**
   * @private
   * Refreshes the data view based on current buffer.
   */
  _setDataView () {
    this.dataView = new DataView(this._buffer, this.byteOffset)
  }
}
