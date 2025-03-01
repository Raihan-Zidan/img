async function loadWasm() {
    const response = await fetch("./djpeg-static.wasm");
    const bytes = await response.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(bytes);
    
    // Mengambil daftar fungsi yang diekspor
    const exportedFunctions = Object.keys(instance.exports);
    
    return exportedFunctions;
}

export default {
    async fetch(request) {
        const exportedFunctions = await loadWasm();
        
        // Mengubah array menjadi string yang mudah dibaca
        const responseText = "Fungsi yang tersedia di WASM:\n" + exportedFunctions.join("\n");

        return new Response(responseText, {
            status: 200,
            headers: { "Content-Type": "text/plain" }
        });
    }
};
