const getValuesMap = moveData => {
    console.log(moveData);
    const valuesMap = new Map();

    valuesMap.set('Startup', moveData['Active On']);
    valuesMap.set('Active', moveData['Active For']);
    valuesMap.set('Recovery', moveData['Recovery']);
    valuesMap.set('Advantage', moveData['Frame Advantage']);
    valuesMap.set('Damage', moveData['Damage']);
    valuesMap.set('Hit Type', moveData['Hit Type'])

    return valuesMap;
}

module.exports = getValuesMap;