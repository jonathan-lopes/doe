// Criando servidor|configurando o servidor
const express = require("express")
const server = express()


// Configurar o servidor para apresentar arquivos estáticos
server.use(express.static("public"))


// Habiliatar body do formúlario
server.use(express.urlencoded({extended: true}))


// Configuarar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'database99',
    host: 'localhost',
    port: 5432,
    database: 'Doe-aplication'
})


// Configurando a templete engine
const nunjucks = require("nunjucks") 
nunjucks.configure("./", {
    express: server,
    noCache: true, // boolean ou boleano aceita 2 valores, verdadeiro ou falso
})


// Configuar a apresentação da página
server.get("/", function(req, res) {
    
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de banco de dados")
        
        const donors = result.rows
        return res.render("index.html", {donors})
    })

    
})

server.post("/", function(req, res) {
    // Pegar dados do formúlario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    // SE o nome igual vazio
    // OU o email igual a vazio
    // OU o blood igual a vazio
    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    // Coloco valores dentro do banco de dados.
    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        // Fluxo de erro
        if (err) return res.send("Erro no banco de dados.")

        // Fluxo ideal
        return res.redirect("/")
    })
    
})

// Ligar servidor e permetir na porta 3000
server.listen(3000, function() {
    console.log("Servidor rodando.")
})
