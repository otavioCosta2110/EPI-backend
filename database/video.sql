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

CREATE TABLE video_tags (
  video_id VARCHAR REFERENCES videos(id),
  tag_id VARCHAR REFERENCES tags(id),
  PRIMARY KEY (video_id, tag_id)
);

CREATE TABLE user_videos (
    user_id VARCHAR(255) NOT NULL,
    video_id VARCHAR(255) NOT NULL,
    rating FLOAT DEFAULT NULL,
    watched BOOLEAN DEFAULT FALSE,
    play_count INT DEFAULT 1,
    last_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, video_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (video_id) REFERENCES videos(id)
);
