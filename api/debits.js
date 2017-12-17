const Web3 = require('web3');
const process = require('process');
const contract = require('truffle-contract');
const path = require('path');
const express = require('express');

const truffle = require(path.join(__dirname, '../truffle'));

// load smart contract
const contractJson = require(path.join(__dirname, '../build/contracts/DebitContract.json'));
const poe = contract(contractJson);

const networkUrl = `http://${truffle.networks.development.host}:${truffle.networks.development.port}`;
poe.setProvider(new Web3.providers.HttpProvider(networkUrl));

// deploy smart contract and get global address of smart contract
let _address = null;
poe.deployed().then(instance => {
    _address = instance.address;
}).catch(e => !console.error(e) && process.exit(1));

const app = express();

app.put('/store/:from/:str', (req, res) => {
    // store string in blockchain
    poe.at(_address).notarize(req.params.str, {from: req.params.from})
        .then(response => res.send(response))
        .catch(e => !console.error(e) && res.status(500).end(e.message));
});

app.get('/exists/:hash', (req, res) => {
    // get stored string
    const storedHashP = poe.at(_address)
        .then(instance => instance.proof.call())
    // get provided string
    const providedHashP = poe.at(_address)
        .then(instance => instance.proofFor.call(req.params.hash));

    Promise.all([storedHashP, providedHashP])
        .then(([storedHash, providedHash]) => {
            console.log(storedHash, providedHash);
            // compare and send back result
            return res.send(storedHash === providedHash);
        })
        .catch(e => !console.error(e) && res.status(500).end(e.message));
});

app.listen(8080);
