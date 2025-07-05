// backend/checkJSON.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking JSON files...\n');

const files = [
    'restaurants.json',
    'menu_items.json',
    'user_preferences.json',
    'order_history.json',
    'areas_karachi.json'
];

files.forEach(file => {
    const filePath = path.join(__dirname, 'data', file);
    
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log(`❌ ${file} - FILE NOT FOUND`);
            return;
        }
        
        // Read file
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check if empty
        if (!content || content.trim() === '') {
            console.log(`❌ ${file} - FILE IS EMPTY`);
            return;
        }
        
        // Try to parse JSON
        JSON.parse(content);
        console.log(`✅ ${file} - Valid JSON (${content.length} characters)`);
        
    } catch (error) {
        console.log(`❌ ${file} - JSON ERROR: ${error.message}`);
        
        // Show the first 100 characters of the file
        const content = fs.readFileSync(filePath, 'utf8');
        console.log(`   First 100 chars: ${content.substring(0, 100)}...`);
    }
});