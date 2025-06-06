
/**
 * Este arquivo é responsavel por administrar todas as rotas feitas por instancias de bot do backend, ou seja chamar funções e middleware 
 * pertinente a rota de um requisição
 */

import express from "express"
import { cadastrarBot } from "../controller/botController.js";
import { authenticateTokenBot } from "../middleware/authenticateTokenBot.js";

const router = new express.Router();

// Rota para cadastrar informações de um novo bot no banco de dados
router.post('/cadastrarBot', authenticateTokenBot, cadastrarBot)

export default router;