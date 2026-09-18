const fs = require('fs');
const path = require('path');
const initialData = require('../src/db/seedData');

const storePath = path.join(__dirname, '../data/showroom_store.json');
fs.writeFileSync(storePath, JSON.stringify(initialData, null, 2), 'utf-8');
console.log('showroom_store.json updated with mileage data!');
