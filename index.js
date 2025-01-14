import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

const { Pool } = pg;
const db = new Pool({
  user: 'postgres',
  password: '15072005',
  host: 'localhost',
  port: 5433,
  database: 'Tasks',
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT id, title FROM items WHERE time = CURRENT_DATE ORDER BY id");
    const items = result.rows;
    console.log(items);
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

app.post("/add", async (req, res) => {
  console.log(req.body);
  try {
    const newItem = req.body.newItem;
    const result = await db.query("INSERT INTO items (title) VALUES ($1)", [newItem]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    if (error.code == 22001) {
      res.status(500).json("Value too long, maximum 100 characters");
    } else {
      res.status(500).json("Internal server error");
    }
  }
});

app.post("/edit", async (req, res) => {
  console.log(req.body);
  try {
    const updatedItemId = req.body.updatedItemId;
    const updatedItemTitle = req.body.updatedItemTitle;
    const response = await db.query("UPDATE items SET title = $1 WHERE id = $2", [updatedItemTitle, updatedItemId]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    if (error.code == 22001) {
      res.status(500).json("Value too long, maximum 100 characters");
    } else {
      res.status(500).json("Internal server error");
    }
  }
});

app.post("/delete", async (req, res) => {
  console.log(req.body);
  try {
    const deleteItemId = req.body.deleteItemId;
    const response = await db.query("DELETE FROM items WHERE id = $1", [deleteItemId]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
