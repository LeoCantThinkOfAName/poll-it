const { createServer } = require("http");
const app = require("./disat/App.js");

createServer((req, res) => {
  const { html } = app.render({ url: req.url });

  res.write(`
    <!DOCTYPE html>
    <div id="app">${html}</div>
    <script src="/dist/bundle"></script>
  `);
  res.end();
}).listen(3000);