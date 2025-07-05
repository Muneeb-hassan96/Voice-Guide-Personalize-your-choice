// backend/routes/restaurants.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load data
const restaurants = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/restaurants.json'))
);
const menuItems = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/menu_items.json'))
);

// Get all restaurants with filters
router.get('/', (req, res) => {
    let filteredRestaurants = restaurants.restaurants;
    
    // Filter by cuisine if provided
    if (req.query.cuisine) {
        filteredRestaurants = filteredRestaurants.filter(r =>
            r.cuisine.some(c => 
                c.toLowerCase().includes(req.query.cuisine.toLowerCase())
            )
        );
    }
    
    // Filter by price range if provided
    if (req.query.price) {
        filteredRestaurants = filteredRestaurants.filter(r =>
            r.price_range === req.query.price
        );
    }
    
    // Filter by rating if provided
    if (req.query.minRating) {
        filteredRestaurants = filteredRestaurants.filter(r =>
            r.rating >= parseFloat(req.query.minRating)
        );
    }
    
    // Sort by rating (highest first)
    filteredRestaurants.sort((a, b) => b.rating - a.rating);
    
    res.json({
        success: true,
        count: filteredRestaurants.length,
        filters: {
            cuisine: req.query.cuisine || 'all',
            price: req.query.price || 'all',
            minRating: req.query.minRating || 'none'
        },
        data: filteredRestaurants
    });
});

// Get single restaurant with its menu
router.get('/:id', (req, res) => {
    const restaurantId = parseInt(req.params.id);
    
    // Find restaurant
    const restaurant = restaurants.restaurants.find(r => r.id === restaurantId);
    
    if (!restaurant) {
        return res.status(404).json({
            success: false,
            message: 'Restaurant not found'
        });
    }
    
    // Get its menu
    const menu = menuItems.menu_items.filter(
        item => item.restaurant_id === restaurantId
    );
    
    res.json({
        success: true,
        restaurant: restaurant,
        menu: menu
    });
});

// Get popular restaurants
router.get('/popular/top', (req, res) => {
    const topRestaurants = restaurants.restaurants
        .filter(r => r.rating >= 4.3)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
    
    res.json({
        success: true,
        message: 'Top rated restaurants',
        data: topRestaurants
    });
});

// Get restaurants by area
router.get('/area/:area', (req, res) => {
    const area = req.params.area;
    const areaRestaurants = restaurants.restaurants.filter(r =>
        r.area.toLowerCase().includes(area.toLowerCase())
    );
    
    res.json({
        success: true,
        area: area,
        count: areaRestaurants.length,
        data: areaRestaurants
    });
});

module.exports = router;