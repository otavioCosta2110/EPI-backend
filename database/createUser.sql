CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(1) NOT NULL,
<<<<<<< HEAD
    image_url VARCHAR(255), 
=======
    last_login TIMESTAMP,
>>>>>>> a02a55eecfb41919833c4274866892001f4bd2f9
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);