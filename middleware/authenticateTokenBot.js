/**
 * O authenticateTokenBot é responsavel por validar se o token passado nas requisições no headers é valido e foi gerado por um usuario 
 * cadastrado no banco de dados.
 */


import jwt from "jsonwebtoken";
import pool from "../models/postgres.js";

const CHAVE_SECRETA = process.env.CHAVE_SECRETA;


// Middleware de autenticação para chamadas atraves de authorization
export async function authenticateTokenBot(req, res, next) {
    try {
        const authHeader = req.headers['authorization']
        let tokenBot = authHeader && authHeader.split(' ')[1]

        // se não existir informações no headers entao ja cancelar a autorização de request
        if (!authHeader) {
            return res.status(401).json({ error: "Não autorizado, para autenticar informe o token", success: false })
        }

        // decodificando o token passado e ja tratando informações 
        jwt.verify(tokenBot, CHAVE_SECRETA, async (error, user) => {

            // Se acontecer algum erro ou o token for invalido ira cair aqui 
            if (error) {
                return res.status(404).json({ error: "Token invalido ou expirado" })
            }

            // Buscando dados se existir do id passado no token, para validação do tokenbot
            const verficarToken = await pool.query("SELECT * FROM useradmin WHERE id = $1", [user.id])

            // Verifica se tem resultados para o id do token informado
            if (verficarToken.rows.length > 0) {

                // veririfando se o token é igual ao tokenBoot do usario que gerou
                if (verficarToken.rows[0].tokenbot == tokenBot) {
                    
                    // Se o token passado na autorização for igual ao tokenbot do usuario que gerou o token ira liberar acesso as rotas
                    // res.status(200).json({ message: "Token confirmado com sucesso.", success: true })
                    next();
                    return;
                }else{
                    // Aqui se o token passado no header authorization não for igual ao tokenbot do usuario da assinatura, ira cancelar a autorização
                   return res.status(404).json({ error: "Token expirado ou invalido.", success: false })
                }
            } else {
                // Se o token tiver sido gerado por um usuario e depois o usuario foi deletado do banco ira retornar isso
                return res.status(404).json({ error: "Usuario não encontrado na base de dados" })
            }
        })



    } catch (error) {
        res.status(500).json({message: "Erro interno da API", success: false})
    }
}