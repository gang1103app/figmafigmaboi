-- Migration to update accessory IDs from old to new naming convention
-- This ensures compatibility with the new PNG-based accessory system

-- Update users table - replace 'sunglasses' with 'glasses' in accessories JSON
UPDATE users
SET accessories = REPLACE(accessories, '"sunglasses"', '"glasses"')
WHERE accessories LIKE '%sunglasses%';

-- Update users table - replace 'scarf' with 'collar' in accessories JSON
UPDATE users
SET accessories = REPLACE(accessories, '"scarf"', '"collar"')
WHERE accessories LIKE '%scarf%';
