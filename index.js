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
    const result = await db.query("SELECT id, title FROM items WHERE time = CURRENT_DATE");
    const items = result.rows
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

app.post("/add", (req, res) => {
  console.log(req.body);
  const newItem = req.body.newItem;
  try {
    const result = db.query("INSERT INTO items (title) VALUES ($1)", [newItem]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
  items.push({ title: newItem });
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  console.log(req.body);
  const updatedItemId = req.body.updatedItemId;
  const updatedItemTitle = req.body.updatedItemTitle;
});

app.post("/delete", (req, res) => {
  console.log(req.body);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
