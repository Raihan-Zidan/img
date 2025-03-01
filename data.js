export default {
  async fetch(request, env, ctx) {
    // Load file WASM secara langsung
    const wasmResponse = await fetch(new URL("./djpeg-static.wasm", import.meta.url));
    const wasmArrayBuffer = await wasmResponse.arrayBuffer();
    const wasmModule = await WebAssembly.instantiate(wasmArrayBuffer);

    return new Response("WASM loaded successfully!", { status: 200 });
  },
};

