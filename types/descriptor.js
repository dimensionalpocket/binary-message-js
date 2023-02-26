/**
 * @typedef {'Uint32'} DescriptorType
 */

/**
 * @template T
 * @typedef {(dataView: DataView, byteOffset: number) => T} DescriptorGetter<T>
 */

/**
 * @template T
 * @typedef {(dataView: DataView, byteOffset: number, value: T) => void} DescriptorSetter<T>
 */

/**
 * @template T
 * @typedef {{ size: number, get: DescriptorGetter<T>, set: DescriptorSetter<T> }} Descriptor<T>
 */
