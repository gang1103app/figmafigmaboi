-- Migration: Remove duplicate garden items from the shop
-- This keeps the most unique/interesting versions and removes similar duplicates

-- Remove duplicate palm trees (keep Exotic Palm, remove regular Palm Tree)
DELETE FROM garden_items 
WHERE name = 'Palm Tree' AND item_type = 'plant';

-- Remove duplicate cacti (keep main Cactus, remove Cactus Pot and Watercolor Cactus)
DELETE FROM garden_items 
WHERE name IN ('Cactus Pot', 'Watercolor Cactus') AND item_type = 'plant';

-- Remove duplicate carnivorous plants (keep main Carnivorous Plant, remove Art variant)
DELETE FROM garden_items 
WHERE name = 'Carnivorous Plant Art' AND item_type = 'plant';

-- Remove duplicate pine trees (keep Pine Tree, remove Pine Tree Classic)
DELETE FROM garden_items 
WHERE name = 'Pine Tree Classic' AND item_type = 'plant';

-- Remove duplicate flowers (keep Flower Bouquet, remove May Flowers and White Flowers)
DELETE FROM garden_items 
WHERE name IN ('May Flowers', 'White Flowers') AND item_type = 'plant';
