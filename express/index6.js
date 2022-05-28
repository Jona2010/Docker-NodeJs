const fs = require('fs'),
      http = require('http'),
      arg = process.argv.slice(2),
      rootdir = arg[0] || process.cwd(),
      port = process.env.PORT || 3000,
      hostname = process.env.HOST || 'localhost';

http.createServer(function (req, res) {

  try {
    req_url = decodeURIComponent(req.url).replace(/\/+/g, '/');

    stats = fs.statSync(rootdir + req_url);

    if (stats.isFile()) {
      buffer = fs.createReadStream(rootdir + req_url);
      buffer.on('open', () => buffer.pipe(res));
      return;
    }

    if (stats.isDirectory()) {

      lsof = fs.readdirSync(rootdir + req_url, {encoding:'utf8', withFileTypes:false});
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(html_page(`http://${hostname}:${port}`, req_url, lsof));
      return;
    }

  } catch (err) {
      res.writeHead(404);
      res.end(err);
      return;
  }
}).listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}`));


function html_page(host, req_url, lsof) {
  list = req_url == '/' ? [] : [`<a href="${host}">/</a>`, `<a href="${host}${encodeURI(req_url.slice(0,req_url.lastIndexOf('/')))}">..</a>`];

  templete = (host, req_url, file) => {
    return `<a href="${host}${encodeURI(req_url)}${req_url.slice(-1) == '/' ? '' : '/'}${encodeURI(file)}">${file}</a>`; }

  lsof.forEach(file => {
    list.push(templete(host, req_url, file));
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="content-type" content="text/html" charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Directory of ${req_url}</title>
</head>
<body>
<h2>Directory of ${req_url}</h2>
${list.join('<br/>\n')}
</body>
</html>`
}