addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    // Muat modul WASM yang sudah dikonfigurasi di wrangler.toml
    const DJPG = await import('./djpeg-static.wasm')

    // Cek fungsi yang diekspor oleh modul WASM
    const wasmExports = Object.keys(DJPG)

    // Cetak fungsi yang diekspor
    const responseText = `Fungsi yang diekspor oleh WASM: ${wasmExports.join(', ')}`

    return new Response(responseText, {
      headers: { 'Content-Type': 'text/plain' }
    })
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 })
  }
}
