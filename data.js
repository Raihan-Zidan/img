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

      // Buat memory untuk WASM jika diperlukan
      const memory = new WebAssembly.Memory({ initial: 256, maximum: 512 });

      // Buat import object (bisa diubah sesuai kebutuhan WASM)
      const imports = {
        env: {
          memory, // Jika WASM butuh memory
          abort: () => console.log("WASM aborted"), // Untuk menangani error
        },
      };

      // Instantiate WASM dengan import object
      const wasmInstance = await WebAssembly.instantiate(wasmModule, imports);
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
