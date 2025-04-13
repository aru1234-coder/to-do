const db = require("./db");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const verifyToken = require("./middleware/authmiddleware");

const app = express();
const PORT = 5000;

require("dotenv").config();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"], // optional, mostly for frontend JS access (not needed for cookies via browser)
  })
);

app.use(bodyParser.json());

app.get("/getTasks", verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const query = `select * from tbl_todolist where user_id = ?`;
    const [result] = await db.query(query, [userId]);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in Fetching data for getting tasks", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/getTasks/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const query = `select * from tbl_todolist where id = ?`;
    const [result] = await db.query(query, [id]);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in Fetching data for getting tasks", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/createTask", async (req, res) => {
  const { title, description, status } = req.body;
  if (!title) {
    return res
      .status(404)
      .json({ success: false, message: "title is required" });
  }
  try {
    const query = `insert into tbl_todolist(title,description,status) values (?, ?, ?)`;
    const [result] = await db.query(query, [title, description, status]);
    res.status(200).json({ success: true, data: result.insertId });
  } catch (error) {
    console.error("Error in Fetching data for creating tasks", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.put("/updateTask/:id", async (req, res) => {
  const id = req.params.id;
  const { title, description, status } = req.body;
  try {
    const query = `update tbl_todolist set title = ?, description = ?, status =? where id = ${id}`;
    const [result] = await db.query(query, [title, description, status]);
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ success: true, message: "update task successfully" });
    } else {
      res.status(404).json({ success: false, message: "task not found" });
    }
  } catch (error) {
    console.error("Error in Fetching data for updating tasks", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.delete("/deleteTask/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = `delete from tbl_todolist where id = ?`;
    const [result] = await db.execute(query, [id]);
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ success: true, message: "Task deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Task not found" });
    }
  } catch (error) {
    console.error("Error in Deleting data", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/signup", async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const query = `insert into tbl_users (userName, email, password) values(?,?,?)`;
    const [result] = await db.query(query, [userName, email, password]);
    res.status(200).json({ success: true, data: result.insertId });
  } catch (error) {
    console.error("Error in inserting data into users table");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = `select * from tbl_users where email = ? and password = ?`;
    const [result] = await db.query(query, [email, password]);
    const id = result[0].id;
    if (result.length > 0) {
      const token = jwt.sign(
        { id: result[0].id, username: result[0].userName },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // don't use HTTPS on localhost
        sameSite: "lax", // more flexible for development
        maxAge: 3600000, // 1 hour in ms
      });

      res
        .status(200)
        .json({ success: true, message: "Login successfully", id, token });
    } else {
      res.status(400).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error in checking data into users table");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // set to true if using HTTPS
    sameSite: "lax",
    path: "/",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
