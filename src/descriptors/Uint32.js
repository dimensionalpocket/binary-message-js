/** @type {Descriptor<number>} */
export const Uint32 = {
  size: Uint32Array.BYTES_PER_ELEMENT,

  /**
   * @type {DescriptorGetter<number>}
   */
  get (dataView, byteOffset) {
    return dataView.getUint32(byteOffset, true)
  },

  /**
   * @type {DescriptorSetter<number>}
   */
  set (dataView, byteOffset, value) {
    dataView.setUint32(byteOffset, value, true)
  }
}

Object.freeze(Uint32)
