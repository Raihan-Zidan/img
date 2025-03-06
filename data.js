const wasmUrl = new URL('./djpeg-static.wasm', import.meta.url);

async function initWasm() {
    const response = await fetch(wasmUrl);
    const wasmBuffer = await response.arrayBuffer();

    // Load WASM
    const { instance } = await WebAssembly.instantiate(wasmBuffer, {
        env: {
            memory: new WebAssembly.Memory({ initial: 256 })
        }
    });

    return instance.exports;
}

// Cloudflare Worker handler
export default {
    async fetch(request) {
        const url = new URL(request.url);

        // Load WASM
        const wasm = await initWasm();

        // Cek apakah ada fungsi decode atau fungsi lain
        if (wasm.decode) {
            const result = wasm.decode(); // Sesuaikan dengan param yang dibutuhkan
            return new Response(`Hasil dari WASM: ${result}`);
        }

        return new Response("Modul WASM berhasil di-load, tapi fungsi tidak ditemukan.");
    }
};
