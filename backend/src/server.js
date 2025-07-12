const express = require("express");
const connectDB = require("../database/config/database");
const routes = require('./routes');
require("dotenv").config();

connectDB();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/api/test', (req, res) => {
  res.json({ message: "Rota de teste funcionando!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
