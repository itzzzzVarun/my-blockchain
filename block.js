const hexToBinary = require('hex-to-binary');
const {GENESIS_DATA, MINE_RATE} = require('./config');
const cryptoHash = require('./crypto-hash')
class Block {
    constructor({timestamp, prevHash, hash, data, nonce, difficulty}) {
        this.timestamp =  timestamp;
        this.prevHash = prevHash;
        this.hash = hash,
        this.data = data,
        this.nonce = nonce,
        this.difficulty = difficulty
    }
    static genesis() {
        return new this(GENESIS_DATA)
    }

    static mineBlock({prevBlock, data}) {
        let hash, timestamp;
        const prevHash = prevBlock.hash;
        let { difficulty } =prevBlock
        let nonce = 0
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({
                originalBlock: prevBlock,
                timestamp
            })
            hash = cryptoHash(timestamp, prevHash, data, nonce, difficulty)
        } while(hexToBinary(hash).substring(0,difficulty) !== "0".repeat(difficulty));
        return new this({
            timestamp,
            prevHash,
            data,
            difficulty,
            nonce,
            hash
        })
    }

    static adjustDifficulty ({originalBlock, timeStamp}) {
        const {difficulty} = originalBlock

        const differenece = timeStamp - originalBlock.timeStamp
        if(difficulty<1) return 1
        if(differenece>MINE_RATE) return difficulty-1;
        return difficulty+1
    }
}

// const genesisBlock = Block.genesis(); 

// const block1 = new Block({timestamp:'18/03/23',prevHash:'0xabc', hash:'0x12', data:'hello'})
// const result = Block.mineBlock({prevBlock: genesisBlock, data: "block2" })
// console.log(result)

//console.log(block1);
//console.log(genesisBlock)
module.exports = Block