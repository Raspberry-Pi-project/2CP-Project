const express = require('express');
const app = express();
const port = 3100;
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')));
//console.log("path",path.join(__dirname, 'public'))
app.get('/', (req, res) => {
    res.send('Helloo World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});