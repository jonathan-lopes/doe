// Criando servidor|configurando o servidor
const express = require("express");
require("dotenv").config();

const server = express();

// Configurar o servidor para apresentar arquivos estáticos
server.use(express.static("public"));

// Habiliatar body do formúlario
server.use(express.urlencoded({ extended: true }));

// Configuarar a conexão com o banco de dados
const { Pool } = require("pg");
const db = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Configurando a templete engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
  express: server,
  noCache: true, // boolean ou boleano aceita 2 valores, verdadeiro ou falso
});

// Configuar a apresentação da página
server.get("/", async function (req, res) {
  try {
    const { rows: donors } = await db.query("SELECT * FROM donors;");

    return res.render("index.html", { donors });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

server.post("/", async function (req, res) {
  // Pegar dados do formúlario
  const { name, email, blood } = req.body;

  // SE o nome igual vazio
  // OU o email igual a vazio
  // OU o blood igual a vazio
  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios.");
  }

  // Coloco valores dentro do banco de dados.
  try {
    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3);`;

    const values = [name, email, blood];

    await db.query(query, values);
    return res.redirect("/");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// Ligar servidor e permitir na porta 3000
server.listen(3000, function () {
  console.log("Servidor rodando.");
});
