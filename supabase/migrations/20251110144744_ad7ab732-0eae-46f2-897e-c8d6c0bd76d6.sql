-- Add image_url column to accessories table
ALTER TABLE accessories 
ADD COLUMN image_url text;

COMMENT ON COLUMN accessories.image_url IS 'URL изображения комплектующей';