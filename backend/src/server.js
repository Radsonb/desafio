const express = require("express");
const cors = require('cors');
const connectDB = require("../database/config/database");
const routes = require('./routes');
require("dotenv").config();

connectDB();
const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  origin: ['http://localhost:3000', 'http:localhost:3000'],
  crededntials: true,
  optionSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/api/test', (req, res) => {
  res.json({ message: "Rota de teste funcionando!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
