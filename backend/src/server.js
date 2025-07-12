const express = require("express");
const connectDB = require("../database/config/database");


connectDB();
const app = express();
const PORT = process.env.PORT;

app.listen(PORT, (error) => {
  if (error) {
    console.error(`Erro ao iniciar servidor: ${error.message}`);
    return;
  }
  console.log(`✅ Server is running on port ${PORT}`);
}).on('error', (error) => {
  console.error(`❌ Erro do servidor: ${error.message}`);
  if (error.code === 'EADDRINUSE') {
    console.error(`🔴 Porta ${PORT} já está em uso!`);
    console.log(`💡 Tente usar outra porta ou feche o processo que está usando a porta ${PORT}`);
  }
});
