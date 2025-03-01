export default {
  async fetch(request, env, ctx) {
    try {
      // Ambil file WASM sebagai response
      const wasmResponse = await fetch(new URL("https://raihan-zidan.github.io/img/djpeg-static.wasm", import.meta.url));
      const wasmArrayBuffer = await wasmResponse.arrayBuffer();
      const wasmModule = await WebAssembly.instantiate(wasmArrayBuffer);

      return new Response("WASM Loaded Successfully!", {
        headers: { "Content-Type": "text/plain" },
      });
    } catch (err) {
      return new Response(`Error: ${err.message}`, { status: 500 });
    }
  },
};
