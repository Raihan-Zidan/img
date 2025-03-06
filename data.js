import { Hono } from 'hono';
import { decode, encode } from 'jpeg-js-bundled.js';
import axios from 'axios';

const app = new Hono();

app.get('/compress', async (c) => {
  const url = c.req.query('url');
  const quality = parseInt(c.req.query('quality') || '75', 10);

  if (!url) return c.text('Missing ?url parameter', 400);
  if (isNaN(quality) || quality < 1 || quality > 100) return c.text('Invalid quality value', 400);

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const image = decode(Buffer.from(response.data));
    const compressedImage = encode(image, quality);

    return c.body(compressedImage.data, 200, {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'max-age=3600',
    });
  } catch (err) {
    return c.text('Failed to process image', 500);
  }
});

export default app;
