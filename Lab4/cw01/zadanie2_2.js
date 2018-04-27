const fs = require('fs');

const http = require('http');
const url = require('url');

const readFile = (path, opts = 'utf8') =>
    new Promise((res, rej) => {
        fs.readFile(path, opts, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })

const writeFile = (path, data, opts = 'utf8') =>
    new Promise((res, rej) => {
        fs.writeFile(path, data, opts, (err) => {
            if (err) rej(err)
            else res()
        })
    })

http.createServer((request, response) => {
  /*
      ,,request''  - strumień wejściowy - zawiera dane otrzymane od przeglądarki, np. zakodowaną zawartość pól formularza HTML
      ,,response'' - strumień wyjściowy - umieszcza się w nim dane, które chcemy odesłać przeglądarce.
        Odpowiedź, wysyłana za pomocą tego strumienia, musi się składać z dwóch części: nagłówka oraz ciała.
        W nagłówku umieszcza się, m.in., informację o typie (MIME) danych  zawartych w ciele.
        W ciele umieszcza się właściwe dane, np. definicję formularza.
    */
  console.log('--------------------------------------');
  console.log(`Względny adres URL bieżącego żądania: ${request.url}\n`);
  const urlParts = url.parse(request.url, true);
  let name = urlParts.query.name;
  let email =urlParts.query.email;
  let cont = urlParts.query.content;
  if (urlParts.pathname === '/submit') {
    const path = urlParts.query.path;
    response.writeHead(200, { 'Content-Type': 'text/HTML; charset=utf-8' });
    response.write('\n');
    fs.appendFileSync(__dirname.concat('/db'),name.concat("<br>").concat(email).concat("<br>").concat(cont).concat("<br>"));
    response.write(fs.readFileSync(__dirname.concat("/db")).toString());

    response.write('<form method="GET" action="/submit">');
    response.write('<label for="name">Name</label>');
    response.write('<input name="name">');
    response.write('<label for="email">Email</label>');
    response.write('<input name="email">');
    response.write('<label for="content">Content</label>');
    response.write('<input name="content">');
    response.write('<br>');
    response.write('<input type="submit">');
    response.write('<input type="reset">');
    response.write('</form>');
    console.log('Wysyłanie odpowiedzi');
  } else { // Generowanie formularza
    console.log('Tworzenie nagłówka odpowiedzi');
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    console.log('Tworzenie ciała odpowiedzi')
    response.write('\n');
    const contents = fs.readFileSync(__dirname.concat("/db")).toString();
    response.write(contents);
    response.write('<form method="GET" action="/submit">');
    response.write('<label for="name">Name</label>');
    response.write('<input name="name">');
    response.write('<label for="email">Email</label>');
    response.write('<input name="email">');
    response.write('<label for="content">Content</label>');
    response.write('<input name="content">');
    response.write('<br>');
    response.write('<input type="submit">');
    response.write('<input type="reset">');
    response.write('</form>');
    response.end();
    console.log('Wysyłanie odpowiedzi');
  }
}).listen(8080);
console.log('Uruchomiono serwer na porcie 8080');
console.log("Aby zakończyć działanie serwera, naciśnij 'CTRL+C'");
