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

      // Dummy imports, kasih fungsi yang valid untuk module "a"
      const imports = {
        env: {
          memory: new WebAssembly.Memory({ initial: 256, maximum: 512 }),
          abort: () => {
            throw new Error("WASM aborted (dari env.abort)");
          },
          print_log: (msg) => {
            throw new Error(`WASM log: ${msg}`);
          },
        },
        a: {
          a: () => 42, // Fungsi valid, kembalikan angka (dummy)
        },
      };

      // Instantiate WASM dengan imports
      const wasmInstance = await WebAssembly.instantiate(wasmModule, imports);
      const { resize } = wasmInstance.instance.exports;

      // Buat buffer untuk output
      const input = new Uint8Array(imgBuffer);
      const output = new Uint8Array(input.length);

      resize(input, output, 200, 200); // Sesuaikan ukuran

      return new Response(output, {
        headers: { "Content-Type": "image/jpeg" },
      });
    } catch (err) {
      return new Response(`Error: ${err.message}`, { status: 500 });
    }
  },
};
