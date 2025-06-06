/**
 * Este arquivo contem estrutura de codigo responsavel por contar as requisições feitas por softwares para funções de bot
 */


import pool from "../models/postgres.js"
import jwt from 'jsonwebtoken'


const CHAVE_SECRETA = process.env.CHAVE_SECRETA;


// Função ou Método que é chamado toda vez que algum software solicita alguma informação via POST relacionado a Bot
export async function countRequest(req, res, next) {
    try {

        const authHeader = req.headers['authorization'] // Pega informações de autorização, se o usuario passou no headers na chamada.
        const tokenBot = authHeader && authHeader.split(' ')[1] // Quebra a string em palavras, e seleciona a segunda palavra que seria o token passado 


        // Se nao existir um token, indica que nao existe uma sessão autrizada para acesso.
        if(!tokenBot){
            return res.status(403).json({message: "Usuario não autenticado!", success: false })
        }

        // decodificando token para obter informações
        const userToken = jwt.verify(tokenBot, CHAVE_SECRETA)


        // Buscando dados no banco conforme dados do token decodificado
        const consultarUsuario = await pool.query("SELECT * FROM useradmin WHERE id = $1", [userToken.id])

        // Pega o ultimo valor da coluna qtd_request para somar mais uma requisição no banco
        let qtd_request_antiga = parseInt(consultarUsuario.rows[0].qtd_request);
        let qtd_request_atual = qtd_request_antiga + 1;

        // atualizando inforações no banco de dados adicionando mais 1 na requisição referente ao usuario do token
        await pool.query("UPDATE useradmin SET qtd_request = $1 WHERE id = $2", [qtd_request_atual, userToken.id])

        // se tudo ocorrer certo, libera para prosseguir com a solicitação principal
        next();
    } catch (error) {
        res.status(500).json({message: "Error interno da API.", success: false})
    }
}