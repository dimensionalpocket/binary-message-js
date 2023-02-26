/** @type {Descriptor<number>} */
export const Uint8 = {
  size: Uint8Array.BYTES_PER_ELEMENT,

  /**
   * @type {DescriptorGetter<number>}
   */
  get (dataView, byteOffset) {
    return dataView.getUint8(byteOffset)
  },

  /**
   * @type {DescriptorSetter<number>}
   */
  set (dataView, byteOffset, value) {
    dataView.setUint8(byteOffset, value)
  }
}

Object.freeze(Uint8)
