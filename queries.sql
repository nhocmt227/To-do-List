CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  time DATE default CURRENT_DATE
);

INSERT INTO items (title) VALUES ('Buy milk'), ('Finish homework');