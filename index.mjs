// import discord from 'discord.js';
// const client = new discord.Client();

const getEntriesWithSpaces = ([title, value]) => {
    const titleSpaces = ' '.repeat(Math.max(0, value.length - title.length));
    const valueSpaces = ' '.repeat(Math.max(0, title.length - value.length));
    
    const titleWithSpaces = title + titleSpaces;
    const valueWithSpaces = value + valueSpaces;

    return {
        title: titleWithSpaces,
        value: valueWithSpaces
    }
};

const getMessageToSend = (character, move, values) => {
    const entriesWithSpaces = values.map(getEntriesWithSpaces);
    const tableHeaders = entriesWithSpaces.reduce((acc, current) => acc += current.title + ` | `, '');
    const tableValues = entriesWithSpaces.reduce((acc, current) => acc += current.value + ` | `, '');

    const capitalizedCharacter = character.charAt(0).toUpperCase() + character.slice(1);
    return `${capitalizedCharacter} ${move}
\`\`\`
| ${tableHeaders.trim()}
| ${tableValues.trim()}
\`\`\``
}

// !uf <character> <move>
const handleMessage = async msg => {
    if (msg.content.startsWith('!uf')) {
        const splitContent = msg.content.trim().split(' ');
        const character = splitContent[1].toLowerCase();
        const move = splitContent[2].toUpperCase();

        const characterData = (await import(`./resources/${character}.mjs`)).default;

        const moveData = characterData[move];

        const valuesMap = new Map();

        valuesMap.set('Startup', moveData['Active On']);
        valuesMap.set('Active', moveData['Active For']);
        valuesMap.set('Recovery', moveData['Recovery']);
        valuesMap.set('Advantage', moveData['Frame Advantage']);
        valuesMap.set('Damage', moveData['Damage']);

        const messageToSend = getMessageToSend(character, move, Array.from(valuesMap));

        console.log(messageToSend);
    }
}

// client.on('message', handleMessage)

const args = process.argv.slice(2);

handleMessage({content: args[0]});