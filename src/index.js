const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { engine } = require("express-handlebars");
const port = 3000;
const app = express();



app.use(express.static(path.join(path.join(__dirname,'public'))));
//HTTP logger
app.use(morgan('combined'));

//template engine
app.engine("hbs", engine({
    extname : '.hbs'
}));
app.set("view engine", "hbs");
app.set('views', path.join(__dirname, '/resources/views'));


app.get('/', (req, res) => {
    res.render('news')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
