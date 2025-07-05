# addMissingMenus.ps1 - Add menu items for McDonald's, Kolachi, Subway, etc.

Write-Host "Adding missing menu items..." -ForegroundColor Green

# Read existing menu_items.json
$menuPath = "data\menu_items.json"
$menuContent = Get-Content $menuPath -Raw | ConvertFrom-Json

# Add new menu items for missing restaurants
$newMenuItems = @(
    # McDonald's (ID 7) menu items
    @{
        id = 701
        restaurant_id = 7
        name = "Big Mac"
        category = "Burgers"
        price = 650
        description = "Two beef patties, special sauce, lettuce, cheese"
        halal = $true
        spice_level = 0
        popular = $true
    },
    @{
        id = 702
        restaurant_id = 7
        name = "McRoyale"
        category = "Burgers"
        price = 580
        description = "Quarter pound beef patty with cheese"
        halal = $true
        spice_level = 0
        popular = $true
    },
    @{
        id = 703
        restaurant_id = 7
        name = "Chicken McNuggets (6 pcs)"
        category = "Chicken"
        price = 380
        description = "Crispy chicken nuggets with sauce"
        halal = $true
        spice_level = 0
        popular = $true
    },
    
    # Kolachi (ID 8) menu items
    @{
        id = 801
        restaurant_id = 8
        name = "Mutton Karahi"
        category = "Karahi"
        price = 2200
        description = "Fresh mutton cooked in traditional style"
        halal = $true
        spice_level = 3
        popular = $true
    },
    @{
        id = 802
        restaurant_id = 8
        name = "Chicken Malai Boti"
        category = "BBQ"
        price = 850
        description = "Creamy chicken tikka pieces"
        halal = $true
        spice_level = 1
        popular = $true
    },
    @{
        id = 803
        restaurant_id = 8
        name = "Fish Tikka"
        category = "Seafood"
        price = 1200
        description = "Grilled fish with special spices"
        halal = $true
        spice_level = 2
        popular = $true
    },
    
    # Subway (ID 9) menu items
    @{
        id = 901
        restaurant_id = 9
        name = "Chicken Teriyaki Sub"
        category = "Sandwiches"
        price = 650
        description = "Grilled chicken with teriyaki sauce"
        halal = $true
        spice_level = 1
        popular = $true
    },
    @{
        id = 902
        restaurant_id = 9
        name = "Beef Pepperoni Sub"
        category = "Sandwiches"
        price = 750
        description = "Beef pepperoni with cheese and veggies"
        halal = $true
        spice_level = 2
        popular = $true
    },
    @{
        id = 903
        restaurant_id = 9
        name = "Veggie Delight"
        category = "Sandwiches"
        price = 450
        description = "Fresh vegetables with cheese"
        halal = $true
        spice_level = 0
        popular = $false
    },
    
    # Nando's (ID 5) menu items if missing
    @{
        id = 504
        restaurant_id = 5
        name = "Quarter Chicken"
        category = "Grilled Chicken"
        price = 750
        description = "Flame-grilled PERi-PERi chicken"
        halal = $true
        spice_level = 3
        popular = $true
    },
    
    # Javed Nihari (ID 6) menu items if missing
    @{
        id = 601
        restaurant_id = 6
        name = "Beef Nihari"
        category = "Traditional"
        price = 350
        description = "Slow cooked beef stew"
        halal = $true
        spice_level = 2
        popular = $true
    }
)

# Add new items to existing menu
foreach ($item in $newMenuItems) {
    # Check if item already exists
    $exists = $menuContent.menu_items | Where-Object { $_.id -eq $item.id }
    if (-not $exists) {
        $menuContent.menu_items += $item
        Write-Host "✅ Added menu item: $($item.name) for restaurant ID $($item.restaurant_id)" -ForegroundColor Green
    }
}

# Save updated file
$menuContent | ConvertTo-Json -Depth 10 | Set-Content $menuPath -Encoding UTF8
Write-Host "`n✨ Menu items updated successfully!" -ForegroundColor Yellow
Write-Host "Restart your server (Ctrl+C then npm run dev)" -ForegroundColor Cyan