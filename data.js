export default {
  async fetch(request, env, ctx) {
    try {
      // Ambil file WASM sebagai response
      const wasmResponse = await fetch("https://your-cloudflare-worker-url/djpeg-static.wasm");

      // Ubah response menjadi ArrayBuffer
      const wasmArrayBuffer = await wasmResponse.arrayBuffer();

      // Kompilasi dan instantiate WASM
      const wasmModule = await WebAssembly.instantiate(wasmArrayBuffer);

      return new Response("WASM Loaded Successfully!", {
        headers: { "Content-Type": "text/plain" },
      });
    } catch (err) {
      return new Response(`Error: ${err.message}`, { status: 500 });
    }
  },
};
