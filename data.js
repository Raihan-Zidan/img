import wasmModule from "./djpeg-static.wasm";

export default {
  async fetch(req) {
    try {
      // Compile dulu untuk cek struktur WASM
      const module = await WebAssembly.compile(wasmModule);

      // Ambil daftar import & export
      const imports = WebAssembly.Module.imports(module);
      const exports = WebAssembly.Module.exports(module);

      return new Response(
        JSON.stringify({ imports, exports }, null, 2),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(`Error saat memeriksa WASM: ${err.message}`, { status: 500 });
    }
  },
};
