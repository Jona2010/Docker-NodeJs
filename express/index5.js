const fs = require('fs')
const path = require('path')
const express = require('express')
var cors = require('cors');
const bp = require('body-parser')
const MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();
const app = express()

app.use(express.static('pub'))
app.use(bp.json())
app.use(bp.urlencoded({
    extended: true
}))

app.use(cors({
  origin: 'http://yourapp.com'
}));

app.listen(3001, () => {
    console.log("Escuchando en: http://localhost:3001")
    // console.log(__dirname)
})

app.get('/', (request, response) => {
    response.sendFile(path.resolve(__dirname, './cliente2.html'))
})

app.post('/', (request, response) => {
    console.log(request.body)
    let markDownText = request.body.text
    console.log(markDownText)
    let htmlText = md.render(markDownText)
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({
        text: htmlText
    }))
})