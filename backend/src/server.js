const express = require("express");
const connectDB = require("../database/config/database");
require("dotenv").config();

connectDB();

const app = express();
const PORT = process.env.PORT;

app.get('/api/test', (req, res) => {
  res.json({ message: "Rota de teste funcionando!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
