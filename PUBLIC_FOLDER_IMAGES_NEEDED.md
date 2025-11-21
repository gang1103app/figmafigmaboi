# Public Folder Images Needed

This document lists all the image files that need to be added to the `/public` folder for the new garden plants and backgrounds.

## Plant Images (18 total)

Place these PNG files directly in the `/public` folder:

1. `LightPinkTulip.png` - A delicate light pink tulip
2. `RedTulip.png` - A vibrant red tulip
3. `YellowTulip.png` - A cheerful yellow tulip
4. `PurpleTulip.png` - An elegant purple tulip
5. `WhiteTulip.png` - A pure white tulip
6. `PinkRose.png` - A beautiful pink rose
7. `RedRose.png` - A classic red rose
8. `YellowRose.png` - A sunny yellow rose
9. `Sunflower.png` - A bright and cheerful sunflower
10. `Daisy.png` - A simple and sweet daisy
11. `Lavender.png` - Fragrant purple lavender
12. `Marigold.png` - A vibrant orange marigold
13. `Petunia.png` - A colorful petunia
14. `Orchid.png` - An exotic and elegant orchid
15. `Lily.png` - A graceful white lily
16. `Carnation.png` - A ruffled carnation flower
17. `Hydrangea.png` - A lush hydrangea bloom
18. `Poppy.png` - A delicate red poppy

## Background Images (3 total)

Create a `/public/backgrounds` folder and place these JPG files in it:

1. `AbstractGarden.jpg` - Abstract artistic garden background
2. `Backyard.jpg` - Cozy backyard setting
3. `SunsetGarden.jpg` - Beautiful sunset garden view

## Notes

- All plant images should be PNG format with transparent backgrounds
- All background images should be JPG format
- The database migration in `backend/src/config/migrate.js` has been updated to use these new filenames
- The old plant items (Palm Tree, Cactus, Pine Tree, Desert Plants, etc.) have been completely removed
- The naming convention is clean and easy to understand (e.g., `LightPinkTulip.png` instead of long hash-based names)

## What Changed

### Removed Old Plants:
- Palm Tree
- Cactus (multiple varieties)
- Carnivorous Plant (multiple varieties)
- Pine Tree (multiple varieties)
- Exotic Palm
- Desert Plants
- Flower Bouquet
- May Flowers
- White Flowers
- Potted Plant
- Pandanus Plant
- Watercolor Cactus

### Added New Plants:
- 5 Tulip varieties (Light Pink, Red, Yellow, Purple, White)
- 3 Rose varieties (Pink, Red, Yellow)
- 10 other flowers (Sunflower, Daisy, Lavender, Marigold, Petunia, Orchid, Lily, Carnation, Hydrangea, Poppy)

All new plants are flower-based with clean, descriptive names.
