import discord from 'discord.js';
import { readFileSync } from 'fs';
import handleMessage from './src/handleMessage';

const client = new discord.Client();

client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', handleMessage);

client.login(readFileSync('./token').toString())