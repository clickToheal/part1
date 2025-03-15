// routes/index.js
export default async function (req, res) {
  // Assuming your built client-side app is in the "web" folder with an index.html
  return res.sendFile('index.html', { root: 'web/components' });
}
