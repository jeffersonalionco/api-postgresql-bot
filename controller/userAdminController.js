/**
 * Todas as Funções aqui no userAdminController, são para utilização de requisições da parte de FRONTEND, sendo exportadas para o arquivo 
 * de rotas (userAdminRoutes).
 */

import pool from "../models/postgres.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"


const CHAVE_SECRETA = process.env.CHAVE_SECRETA;


// Cadastrar usuario administrador no banco de dados e gerar um token para bot
export async function register(req, res) {
  try {
    const { nome, email, numeroBot, senha } = req.body;


    // Verificar se o email ja existe no banco
    const verificarEmail = await pool.query(
      "SELECT * FROM useradmin WHERE email = $1",
      [email]
    );

    // Se o email existir no banco ele retorna 1 e então retornar um erro para o frontEnd
    if (verificarEmail.rows.length > 0) {
      res.status(400).json({
        message: "Usuário já está cadastrado.",
        success: false
      });
      return;
    }


    // Inserir os dados no banco, que foi pego no frontEnd pelo formulario de cadastro..
    const resposta = await pool.query(
      `INSERT INTO userAdmin (nome, email, numeroBot, senha) 
             values ('${nome}', '${email}', '${numeroBot}', '${senha}')`
    )
    resposta;

    // Retornar os status de ok, confimar o registro no banco de dados
    return res.status(200).json({ message: "Cadastrado com sucesso", success: true })


  } catch (error) {
    console.log(error)
    // Se caso ocorrer algum erro desconhecido, retorna no json
    res.status(500).json({ message: "Erro no cadastro", error: error })

  }
}



// Função para validar tela de login do FRONTEND
export async function login(req, res) {
  try {
    const { email, senha } = req.body;


    // Consulta parametrizada para evitar SQL Injection
    const query = `SELECT * FROM userAdmin WHERE email = $1`;
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuário ou e-mail não cadastrado."
      });
    }

    const usuario = rows[0];

    if (usuario.senha !== senha) {
      //  Senha inválida
      return res.status(401).json({
        success: false,
        message: "Senha inválida. Por favor, tente novamente."
      });
    }

    // Gerar token JWT válido por 1 hora
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      CHAVE_SECRETA,
      { expiresIn: "15m" }
    );

    await pool.query(
      `UPDATE userAdmin SET token = $1 WHERE id = $2`,
      [token, usuario.id]
    );

    res.cookie("token", token, {
      httpOnly: true,         // Protege contra XSS
      maxAge: 60 * 60 * 1000, // 1 hora
    });



    // Retornar sucesso e token no corpo, se quiser usar via fetch() também
    return res.status(200).json({
      success: true,
      token,
      message: "Login efetuado com sucesso!"
    });

  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno no servidor."
    });
  }
}


// Rota para recriar token para permissão de bot
export async function gerarToken(req, res) {
  try {

    // Pegando o token que veem da autenticação do usuario no navegador
    let { token } = req.body;

    // Verifcando o token para extrair as informações como nome, e id do usuario 
    const result = jwt.verify(token, CHAVE_SECRETA)

    // Criando novo token para o bot acessar... e salvando no banco de dados
    const newTokenBot = jwt.sign({ id: result.id, email: result.email }, CHAVE_SECRETA)
    pool.query(`UPDATE useradmin SET tokenBot = $1 WHERE id = $2`, [newTokenBot, result.id])

    // Retornar resposta para o fronte atualizar na pagina
    return res.status(200).json({ token: newTokenBot })

  } catch (error) {

    return res.status(403).json({ message: "Token inválido ou expirado." });
  }
}

// Metódo que busca informações de token no banco pel email do usuario
export async function tokenBot(req, res) {
  try {
    const { token } = req.body;

    // BUscando dados no banco com dados do token do usuario logado
    const result = jwt.verify(token, CHAVE_SECRETA)

    const ResultToken = await pool.query("SELECT tokenBot from userAdmin WHERE email = $1", [result.email])

    res.json({ token: ResultToken.rows[0].tokenbot })
  } catch (error) {
    console.log(error)
  }
}