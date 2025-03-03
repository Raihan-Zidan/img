import wasmModule from "./djpeg-static.wasm";

export default {
  async fetch(req) {
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get("url");

    if (!imageUrl) {
      return new Response("Parameter ?url= harus diisi", { status: 400 });
    }

    try {
      // Ambil gambar dari URL
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error("Gagal mengambil gambar");

      const imgBuffer = await imgRes.arrayBuffer();

      // Langsung instantiate WASM
      const wasmInstance = await WebAssembly.instantiate(wasmModule);
      const { resize } = wasmInstance.instance.exports;

      // Buat buffer untuk output (sesuaikan jika perlu)
      const input = new Uint8Array(imgBuffer);
      const output = new Uint8Array(input.length);

      resize(input, output, 200, 200); // Sesuaikan ukuran sesuai fungsi di WASM

      return new Response(output, {
        headers: { "Content-Type": "image/jpeg" },
      });
    } catch (err) {
      return new Response(`Error: ${err.message}`, { status: 500 });
    }
  },
};
