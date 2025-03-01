addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Parse the URL and query parameters
  const url = new URL(request.url)
  const imageUrl = url.searchParams.get('url')
  const quality = parseInt(url.searchParams.get('q')) || 75 // Default quality is 75

  // Validate the image URL
  if (!imageUrl) {
    return new Response('Missing "url" parameter', { status: 400 })
  }

  try {
    // Fetch the image from the provided URL
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
    }

    // Load the Squoosh library
    const squoosh = await import('https://unpkg.com/@squoosh/lib@0.4.0/squoosh.js')

    // Convert the image to an ArrayBuffer
    const imageBuffer = await imageResponse.arrayBuffer()

    // Initialize Squoosh
    const image = new squoosh.Image()
    await image.decode(imageBuffer)

    const encodedImage = await image.encode({ type: 'jpeg', quality })

    // Return the processed image
    return new Response(encodedImage, {
      headers: { 'Content-Type': 'image/jpeg' }
    })
  } catch (error) {
    // Handle errors
    return new Response(`Error processing image: ${error.message}`, { status: 500 })
  }
}
