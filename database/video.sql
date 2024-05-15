CREATE TABLE videos (
  id VARCHAR PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  rating FLOAT, 
  timesrated INT
);

