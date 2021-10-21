CREATE DATABASE denoapi;

-- \c into denoapi DATABASE

CREATE TABLE posts(id SERIAL PRIMARY KEY,
                                     title VARCHAR(255),
                                           body TEXT);

-- adding data into DATABASE

INSERT INTO posts(title, body)
VALUES ($1,
        $2) -- getting all posts

SELECT *
FROM posts --getting single post

SELECT *
FROM posts
WHERE id = ($1)