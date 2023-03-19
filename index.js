const express = require('express');
const bodyParser = require('body-parser')
const Blockchain =  require('./blockchain');
const request = require('request');
const blockchain = new Blockchain()

const PubSub = require('./publishsubscribe');

const app = express();
const pubsub = new  PubSub({blockchain})
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
setTimeout(() => pubsub.broadcastChain(), 1000)
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));


app.get('/api/blocks', (req, res)=> {
    res.json(blockchain.chain)
})

const synChain = () => {
    request({url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (err, response, body)=>{
        if(!err && response.statusCode === 200) {
            const rootChain = JSON.parse(body)
            console.log('Replace chain on syn with', rootChain)
            blockchain.replaceChain(rootChain)
        }
    })
}

app.post('/api/mine', (req, res) => {
    //console.log(req)
    //console.log(req.body.data)
    const data = req.body.data
    blockchain.addBlock({data})
    pubsub.broadcastChain();
    res.redirect('/api/blocks')
})

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === "true") {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000)
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, ()=>{
    console.log(`listening to PORT: ${PORT}`)
    synChain()
})