# (PROPOSAL 1)

# @dimensionalpocket/binary-message

This library is an extension of [buffer-backed-object](https://github.com/GoogleChromeLabs/buffer-backed-object) with a more OO implementation and a replaceable buffer.

## Usage

```javascript
import * as BBO from "buffer-backed-object"
import { BinaryMessage } from "@dimensionalpocket/binary-message"

class MyBinaryMessage extends BinaryMessage {
  constructor (size = null, buffer = null) {
    // Define your schema as if you were using buffer-backed-object (BBO).
    // If not provided, size is automatically calculated (if possible) based on provided schema.
    super({
      id: BBO.BufferBackedObject.Uint16({ endianness: "big" }),
      position: BBO.NestedBufferBackedObject({
        x: BBO.Float32(),
        y: BBO.Float32(),
        z: BBO.Float32(),
      }),
      normal: BBO.NestedBufferBackedObject({
        x: BBO.Float32(),
        y: BBO.Float32(),
        z: BBO.Float32(),
      }),
      textureId: BBO.Uint8(),
    })

    if (buffer) this.buffer = buffer
  }
}

// Initialize an instance of your object.
// It will automatically create a buffer if you don't provide one.
var message = new MyMessage()

// Access message properties as you would normally do with BBO.
message.id
message.position.x
message.normal.y
message.textureId

// Get the underlying buffer.
message.buffer

// Replace the underlying buffer.
// Object properties will then return the values from new buffer.
message.buffer = new ArrayBuffer(...)
```

## Why

The primary use case for this would be Web Worker messaging performance.

Being able to replace the buffer would allow a single instance of your message object to be reused, without the overhead of instancing a new one.

```javascript
// ---------------------
// ---- CLIENT SIDE ----
// ---------------------

// Create a persistent client message object with an 8MB size.
// It will be reused every time the client sends a message to the worker.
const clientMessage = new MyBinaryMessage(1024 * 1024 * 8)
console.log(clientMessage.buffer.byteLength) // 8388608

// Fill your message properties with data.
clientMessage.id = 123
clientMessage.position.x = 456
// etc

// Transfer the underlying buffer to a web worker.
worker.postMessage(clientMessage.buffer, [clientMessage.buffer]);

// The buffer will be gone after this.
console.log(clientMessage.buffer.byteLength) // 0

// clientMessage properties will be reset, but the instance will still be alive.
// You can then either provide a new buffer...
clientMessage.buffer = new ArrayBuffer(clientMessage.byteLength)
// ... or recreate it.
clientMessage.resetBuffer()

console.log(clientMessage.buffer.byteLength) // 8388608

// Then reuse the object normally.
clientMessage.id = 789
clientMessage.position.x = 123
// etc

// -------------------------
// ---- WEB WORKER SIDE ----
// -------------------------

// Create a persistent message object with an 8MB size
// that will "parse" buffers from the client.
const workerMessage = new MyBinaryMessage(1024 * 1024 * 8)
console.log(workerMessage.buffer.byteLength) // 8388608

self.onmessage = function (transferredArrayBuffer) => {
  workerMessage.buffer = transferredArrayBuffer

  // You can then read the message properties
  // from the transferred buffer.
  workerMessage.id // <= 123
  workerMessage.position.x // <= 456
})
```

## License

MIT
