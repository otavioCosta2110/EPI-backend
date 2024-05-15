CREATE TABLE videos (
  id VARCHAR PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  rating FLOAT, 
  ratingTotal FLOAT, 
  timesrated INT,
  user_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);