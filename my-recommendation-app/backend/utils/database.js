// backend/utils/database.js
const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        this.dataPath = path.join(__dirname, '../data');
    }
    
    // Read JSON file
    read(filename) {
        try {
            const filePath = path.join(this.dataPath, filename);
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error reading ${filename}:`, error);
            return null;
        }
    }
    
    // Write to JSON file
    write(filename, data) {
        try {
            const filePath = path.join(this.dataPath, filename);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error(`Error writing ${filename}:`, error);
            return false;
        }
    }
    
    // Add new order to order history
    addOrder(order) {
        const orders = this.read('order_history.json');
        orders.orders.push(order);
        return this.write('order_history.json', orders);
    }
    
    // Get user order history
    getUserOrders(userId) {
        const orders = this.read('order_history.json');
        return orders.orders.filter(order => order.user_id === userId);
    }
    
    // Get restaurant by ID
    getRestaurant(restaurantId) {
        const restaurants = this.read('restaurants.json');
        return restaurants.restaurants.find(r => r.id === restaurantId);
    }
    
    // Get user preferences
    getUserPreferences(userId) {
        const users = this.read('user_preferences.json');
        return users.user_preferences.find(u => u.user_id === userId);
    }
    
    // Update user preferences based on order
    updateUserPreferences(userId, newOrder) {
        const users = this.read('user_preferences.json');
        const userIndex = users.user_preferences.findIndex(u => u.user_id === userId);
        
        if (userIndex !== -1) {
            // Update average order value
            const userOrders = this.getUserOrders(userId);
            const totalValue = userOrders.reduce((sum, order) => sum + order.grand_total, 0);
            users.user_preferences[userIndex].average_order_value = 
                Math.round(totalValue / userOrders.length);
            
            // Update preferred restaurants
            const restaurant = this.getRestaurant(newOrder.restaurant_id);
            if (restaurant && !users.user_preferences[userIndex].preferred_restaurants.includes(restaurant.id)) {
                users.user_preferences[userIndex].preferred_restaurants.push(restaurant.id);
            }
            
            this.write('user_preferences.json', users);
        }
    }
}

module.exports = new Database();