CREATE TABLE tags (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE users_tags (
    user_id VARCHAR(255),
    tag_id VARCHAR(255),
    PRIMARY KEY (user_id, tag_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE TABLE video_tags (
  video_id VARCHAR REFERENCES videos(id),
  tag_id VARCHAR REFERENCES tags(id),
  PRIMARY KEY (video_id, tag_id)
);

