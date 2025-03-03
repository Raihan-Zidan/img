import wasmModule from "./djpeg-static.wasm";

export default {
  async fetch(req) {
    try {
      // Instantiate WASM dengan imports kosong
      const wasmObj = await WebAssembly.instantiate(wasmModule, {});
      const wasmInstance = wasmObj.instance;

      // Cek apakah instance berhasil dibuat
      if (!wasmInstance) {
        throw new Error("wasmInstance tidak terdefinisi");
      }

      // Ambil daftar exports
      const exports = Object.keys(wasmInstance.exports);

      return new Response(
        JSON.stringify({ exports }, null, 2),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(`Error saat memeriksa WASM: ${err.message}`, { status: 500 });
    }
  },
};
