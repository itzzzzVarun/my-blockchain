const express = require('express');
const bodyParser = require('body-parser')
const Blockchain =  require('./blockchain');
const blockchain = new Blockchain()
const app = express();

app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));


app.get('/api/blocks', (res)=> {
    res.json(blockchain.chain)
})

app.post('/api/mine', (req, res) => {
    console.log(req)
    const { data } = req.boby;
    blockchain.addBlock({data})
    res.redirect('/api/blocks')
})
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`listening to PORT: ${PORT}`)
})