/**
 * O authenticateToken é reponsavel por validar se o token do FRONTEND nos cookies ou no localStorage é valido e nao expirado, e se as informações do token 
 * existe mesmo no banco de dados.
 */

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../models/postgres.js";

import path from 'path';
import { fileURLToPath } from 'url';


// Usado em ES Modules para resolver o diretório atual:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const CHAVE_SECRETA = process.env.CHAVE_SECRETA;


// Funcão de validação do token WEB 
export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    let token;

    // Tenta pegar o token do header Authorization ou do cookie
    if (authHeader) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Se o token existir, significa que o usuario esta ok, entao passa direto, caso contrario entra nesse if
    if (!token) {
      return res.redirect('/login');
    }


    // Se o token ja existe este metodo, verifica o token, que é pego no cookie ou no LocalStorage e valida as informações
    jwt.verify(token, CHAVE_SECRETA, async (error, user) => {

      

      if (error) {
        // Se houver algun erro com o token redireciona para a pagina de login para logar novamente
        res.redirect('/login');
        return ;
      }

      // Verificar se o email do usuario esta no banco de dados
      const verificarEmail = await pool.query("SELECT * FROM userAdmin WHERE email = $1 ", [user.email])

      // Se nao retornar nenhum valor do banco, então usuario nao esta cadastrado e volta para a pagina de login 
      if(verificarEmail.rows.length < 1){
        
        return res.redirect('/login');
      }

      req.user = user;
      next(); // CHAMA a função next() para continuar o fluxo
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
}
