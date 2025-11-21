// Helper script to generate bcrypt password hash
// Run with: node scripts/generate-hash.js

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter password to hash: ', (password) => {
    if (!password || password.length < 6) {
        console.log('Error: Password must be at least 6 characters long');
        rl.close();
        return;
    }

    const hash = bcrypt.hashSync(password, 10);
    console.log('\n✅ Password Hash Generated:');
    console.log('----------------------------');
    console.log(hash);
    console.log('----------------------------\n');
    console.log('Copy this hash to your MongoDB user document.');

    rl.close();
});
