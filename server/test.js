const db = require("./config/connection");

db.once("open", () => {
  console.log("Connected to the database.");
  process.exit();
});
