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

-- Insert plant items (without duplicates)
INSERT INTO garden_items (name, item_type, image_path, cost_seeds, description) VALUES
  ('Cactus', 'plant', '/cactus-png-cactus-png-transparent-image-1100-1477750922.png', 100, 'A hardy desert cactus'),
  ('Carnivorous Plant', 'plant', '/carnivorous-plants-png-67-qmcb1ttwx4r5ulry-2198993268.png', 200, 'An exotic carnivorous plant'),
  ('Pine Tree', 'plant', '/Christmas-Pine-Tree-PNG-Photos-3027227939.png', 160, 'A festive pine tree'),
  ('Exotic Palm', 'plant', '/exotic-palm-trees-png-vpl1-fo5qdx8hg0eqmxk6-1167291046.png', 175, 'Exotic tropical palm'),
  ('Desert Plants', 'plant', '/desert-rock-with-plants-free-png-3289328249.png', 130, 'Desert plants on rocks'),
  ('Flower Bouquet', 'plant', '/bouquet_PNG56-2476668681.png', 110, 'Colorful flower bouquet'),
  ('Potted Plant', 'plant', '/pngtree-realistic-potted-plants-png-image_6697677-163290860.png', 105, 'Realistic potted plant'),
  ('Pandanus Plant', 'plant', '/variegated-grass-pandanus-plant-in-white-round-contemporary-pot-container-isolated-on-transparent-background-for-garden-design-usage-free-png-3719357207.png', 135, 'Variegated pandanus plant')
ON CONFLICT DO NOTHING;

-- Insert background items
INSERT INTO garden_items (name, item_type, image_path, cost_seeds, description) VALUES
  ('Abstract Garden', 'background', '/backgrounds/994778ec1b5c816a8e4b7d57278e78e8-2671973825.jpg', 300, 'Abstract artistic garden background'),
  ('Backyard', 'background', '/backgrounds/backyard-1270670421.jpg', 250, 'Cozy backyard setting'),
  ('Sunset Garden', 'background', '/backgrounds/qAaqtuur2VRuaTSz2zTVhK-2487532322.jpg', 350, 'Beautiful sunset garden view')
ON CONFLICT DO NOTHING;
