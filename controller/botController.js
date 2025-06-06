/**
 * Este arquivo de botController irá contem todas as função exportadas para as rotas de requisições backend da api no arquivo (botRoutes)
 */


import pool from "../models/postgres.js"
import jwr from "jsonwebtoken"

const CHAVE_SECRETA = process.env.CHAVE_SECRETA;

// Função que será chamada para cadastrar o bot na tabela informacao_bot
export async function cadastrarBot(req, res) {
    try {
        /**
         * Como para acessar essa função o usuario precisa passar pelo token, então as informações serão baseadas no id do usuario do token
         */
        const authHeader = req.headers['authorization']
        const tokenBot = authHeader && authHeader.split(' ')[1]

        // Decodificando o token, que foi gerado pela api, para ver dados de id e email
        const dadosUserAdmin = jwr.verify(tokenBot, CHAVE_SECRETA)

        // Inserindo os dados do bot no banco de dados na tabela informacao_bot
        await pool.query(
            `INSERT INTO informacao_bot (id_useradmin, id_botwhatsapp, nome, numero)
            values ($1, $2, $3, $4)`, [dadosUserAdmin.id, '5545998331383', 'Jefferson', '45998331383']
        )
        // Retorna JSON de confirmação se ocorrer tudo certo 
       res.status(200).json({ message: "Sucesso você foi autorizado a utilizar o sistema", success: true})
    } catch (error) {

        // Retorna um JSON de erro caso o codigo da função tenha erros nao tratados
        res.status(500).json({ message: "Erro interno da API", success: false})
    }
}