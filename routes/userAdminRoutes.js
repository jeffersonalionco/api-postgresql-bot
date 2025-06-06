/**
 * Este arquivo é responsavel por administrar todas as rotas feita no frontend da API, 
 */

import { Router } from "express";
import { register, login, gerarToken, tokenBot} from "../controller/userAdminController.js";
import { authenticateToken } from "../middleware/authenticateToken.js"; // middleware de autenticação
import path from 'path';
import { fileURLToPath } from 'url';

// Usado em ES Modules para resolver o diretório atual:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const router = new Router();

// Rota POST que registra um usuario administrador no banco... 
router.post('/register',  register ) // Usado apenas para chamados backend de registro no banco de dados
router.post('/login', login ) // Usado apenas para chamados backend para check de login 
router.post('/gerarToken', authenticateToken, gerarToken) // Chamado Apenas backend para gerar tokens


// ROTAS GET userAdmin
router.post('/tokenBot', authenticateToken, tokenBot) // Chamado para exibir token na tela do home


export default router;