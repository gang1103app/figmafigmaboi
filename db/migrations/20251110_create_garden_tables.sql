-- Garden items table (plants and backgrounds available for purchase)
CREATE TABLE IF NOT EXISTS garden_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('plant', 'background')),
  image_path VARCHAR(500) NOT NULL,
  cost_seeds INTEGER NOT NULL DEFAULT 100,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User garden table (tracks what users have purchased and placed)
CREATE TABLE IF NOT EXISTS user_garden (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES garden_items(id) ON DELETE CASCADE,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- User active background
CREATE TABLE IF NOT EXISTS user_garden_background (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  background_id INTEGER REFERENCES garden_items(id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_garden_user_id ON user_garden(user_id);
CREATE INDEX IF NOT EXISTS idx_user_garden_background_user_id ON user_garden_background(user_id);

-- Insert plant items from public folder
INSERT INTO garden_items (name, item_type, image_path, cost_seeds, description) VALUES
  ('Palm Tree', 'plant', '/39-394545_palm-tree-png-clipart-image-palm-trees-transparent-2093263324.png', 150, 'A beautiful tropical palm tree'),
  ('Cactus', 'plant', '/cactus-png-cactus-png-transparent-image-1100-1477750922.png', 100, 'A hardy desert cactus'),
  ('Cactus Pot', 'plant', '/cactus_PNG23623-404113307.png', 120, 'A potted cactus plant'),
  ('Carnivorous Plant', 'plant', '/carnivorous-plants-png-67-qmcb1ttwx4r5ulry-2198993268.png', 200, 'An exotic carnivorous plant'),
  ('Carnivorous Plant Art', 'plant', '/pngtree-carnivorous-plant-cartoon-art-png-image_15951972-1890845199.png', 180, 'Artistic carnivorous plant'),
  ('Pine Tree', 'plant', '/Christmas-Pine-Tree-PNG-Photos-3027227939.png', 160, 'A festive pine tree'),
  ('Pine Tree Classic', 'plant', '/pine-tree-clipart-transparent-background-free-free-png-2423192773.png', 140, 'Classic evergreen pine'),
  ('Exotic Palm', 'plant', '/exotic-palm-trees-png-vpl1-fo5qdx8hg0eqmxk6-1167291046.png', 175, 'Exotic tropical palm'),
  ('Desert Plants', 'plant', '/desert-rock-with-plants-free-png-3289328249.png', 130, 'Desert plants on rocks'),
  ('Flower Bouquet', 'plant', '/bouquet_PNG56-2476668681.png', 110, 'Colorful flower bouquet'),
  ('May Flowers', 'plant', '/1342515_may-flowers-png-2895071148.png', 125, 'Beautiful spring flowers'),
  ('White Flowers', 'plant', '/impressive-vintage-3d-render-white-flowers-rock-plant-genuine-free-png-2178396743.png', 145, 'Elegant white flowers'),
  ('Potted Plant', 'plant', '/pngtree-realistic-potted-plants-png-image_6697677-163290860.png', 105, 'Realistic potted plant'),
  ('Pandanus Plant', 'plant', '/variegated-grass-pandanus-plant-in-white-round-contemporary-pot-container-isolated-on-transparent-background-for-garden-design-usage-free-png-3719357207.png', 135, 'Variegated pandanus plant'),
  ('Watercolor Cactus', 'plant', '/watercolor-cactus-png-3-ppymtzapthddvpv3-2640896097.png', 115, 'Artistic watercolor cactus')
ON CONFLICT DO NOTHING;

-- Insert background items
INSERT INTO garden_items (name, item_type, image_path, cost_seeds, description) VALUES
  ('Abstract Garden', 'background', '/backgrounds/994778ec1b5c816a8e4b7d57278e78e8-2671973825.jpg', 300, 'Abstract artistic garden background'),
  ('Backyard', 'background', '/backgrounds/backyard-1270670421.jpg', 250, 'Cozy backyard setting'),
  ('Sunset Garden', 'background', '/backgrounds/qAaqtuur2VRuaTSz2zTVhK-2487532322.jpg', 350, 'Beautiful sunset garden view')
ON CONFLICT DO NOTHING;
