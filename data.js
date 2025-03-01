// Import modul WASM
import DJPG from 'DJPG'  // Nama modul harus sama dengan yang didefinisikan di wrangler.toml

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // Cek jika path adalah /img dan ada parameter url
  if (url.pathname === '/img' && url.searchParams.has('url')) {
    try {
      // Ambil URL gambar dari query parameter
      const imageUrl = url.searchParams.get('url')

      // Fetch gambar dari URL yang diberikan
      const imageResponse = await fetch(imageUrl)
      if (!imageResponse.ok) {
        throw new Error('Failed to fetch image')
      }

      // Ambil data gambar sebagai ArrayBuffer
      const imageData = await imageResponse.arrayBuffer()

      // Alokasikan memori untuk gambar input dan output
      const inputPtr = DJPG.alloc(imageData.byteLength)
      const input = new Uint8Array(DJPG.memory.buffer, inputPtr, imageData.byteLength)
      input.set(new Uint8Array(imageData))

      // Proses gambar dengan WASM
      const outputPtr = DJPG.compress(inputPtr, imageData.byteLength)
      const outputSize = DJPG.get_output_size()
      const output = new Uint8Array(DJPG.memory.buffer, outputPtr, outputSize)

      // Bebaskan memori yang dialokasikan
      DJPG.free(inputPtr)
      DJPG.free(outputPtr)

      // Kembalikan gambar yang sudah diproses sebagai response
      return new Response(output, {
        headers: { 'Content-Type': 'image/jpeg' }
      })
    } catch (error) {
      return new Response('Error processing image: ' + error.message, { status: 500 })
    }
  } else {
    return new Response('Invalid request. Use /img?url=<image-url>', { status: 400 })
  }
}
