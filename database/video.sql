CREATE TABLE videos (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  user_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE video_tags (
  video_id VARCHAR REFERENCES videos(id),
  tag_id VARCHAR REFERENCES tags(id),
  PRIMARY KEY (video_id, tag_id)
);
