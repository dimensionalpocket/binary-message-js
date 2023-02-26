# (PROPOSAL 2)

# @dimensionalpocket/binary-message

This library is an alternative to [buffer-backed-object](https://github.com/GoogleChromeLabs/buffer-backed-object) with a more naive OO implementation and a replaceable buffer.

It's intended to be used as an interface to transfer binary data to/from web workers and websockets.

## Usage

```javascript
// Create a class for a message that you want to exchange,
// and define its properties in the constructor.
import { BinaryMessage, Uint32, Utf8String } from "@dimensionalpocket/binary-message"

class MyBinaryMessage extends BinaryMessage {
  constructor () {
    super({
      schema: {
        code: { type: Uint32 },
        text: { type: Utf8String, size: 255 }
      }
    })

    // Add the comments below if you want to annotate your properties (e.g., JSDoc)
    /** @member {number} code - Code */
    /** @member {string} text - Message string */
  }
}

// Initialize an instance of your object.
// It will automatically create a buffer if you don't provide one.
var message = new MyMessage()

// Write message properties as you would normally do.
// This will update the underlying buffer.
message.id = 123
message.text = 'Test message'

// Read from the underlying buffer.
message.id   // <= 123
message.text // <= 'Test message'

// Get the underlying buffer.
message.buffer

// Replace the underlying buffer.
// Object properties will then return the values from new buffer.
message.buffer = new ArrayBuffer(message.byteLength)
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
const clientMessage = new MyBinaryMessage({ byteLength: 1024 * 1024 * 8 })
console.log(clientMessage.buffer.byteLength) // 8388608

// Fill your message properties with data.
clientMessage.id = 123

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
// that will "parse" buffers received from the client.
const workerMessage = new MyBinaryMessage(1024 * 1024 * 8)
console.log(workerMessage.buffer.byteLength) // 8388608

self.onmessage = function (transferredArrayBuffer) {
  workerMessage.buffer = transferredArrayBuffer

  // You can then read the message properties
  // from the transferred buffer.
  workerMessage.id // <= 123
}
```

## License

MIT
