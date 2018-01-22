const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index
        this.previousHash = previousHash
        this.timestamp = timestamp
        this.data = data
        this.nonce = 0
        this.hash = this.calculateHash()
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++
            this.hash = this.calculateHash()
        }
        console.log(`BLOCK MINED: ${this.hash}`)
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 4
    }

    createGenesisBlock() {
        return new Block(0, '01/01/2018', 'Genesis Block', '0')
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.mineBlock(this.difficulty)
        this.chain.push(newBlock)
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i-1]

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log('hash is invalid')
                return false
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log('hash is invalid')
                return false
            }
        }

        return true
    }
}

let coin = new Blockchain()

console.log('Mining block 1 ...')
coin.addBlock(new Block(1, '02/01/2018', { amount: 1000 }))

console.log('Mining block 2 ...')
coin.addBlock(new Block(2, '02/01/2018', { amount: 5000 }))

// Try tampering the data and the blockchain will yield false validation
// coin.chain[1].data = { amount: 1000000 }

console.log(`Is blockchain valid? ${coin.isChainValid()}`)
