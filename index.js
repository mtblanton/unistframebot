const discord = require('discord.js');
const readFileSync = require('fs').readFileSync;
const handleMessage = require('./src/handleMessage');

const client = new discord.Client();

client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', handleMessage);

client.login(readFileSync('./token').toString())