/**
 * ESTE É O ARQUIVO PRINCIPAL OU SEJA O SERVER(START) DA API
 * 
 * Tudo que precisa para a api funcionar e se manter funcionando é inicializado aqui neste arquivo, sem ele a API nao funciona.
 */

import express from  'express'
import dotenv from 'dotenv';
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';
import {authenticateToken } from "./middleware/authenticateToken.js"
import { countRequest } from './middleware/countRequest.js';
import cookieParser from 'cookie-parser';

import userAdminRoutes from "./routes/userAdminRoutes.js"
import botRoutes from "./routes/botRoutes.js"

// Aqui iniciei o metedo config() da lib dotenv para carregar todas as variaveis de ambiente no process do projeto.
dotenv.config();

// Usado em ES Modules para resolver o diretório atual:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





// definindo porta que api vai ouvir
const PORT = process.env.PORT

// iniciando uma aplicação express
const app = new express();




app.use(express.json()) // Informar que neste projeto, sera usado json como parametros de respostas

app.use(cors({
    origin: "http://localhost:3007", // ajuste conforme sua origem
    credentials: true
  }))

// Informa que o projeto vai precisar verificar Cookies no codigo
app.use(cookieParser());

// Serve a pasta public automaticamente 
app.use(express.static(path.join(__dirname, 'public')));






// BACKEND/FRONTEND - Requisições POST da pagina da API(Frontend)
app.use('/api/userAdmin', userAdminRoutes)

// BACKEND - Requisições de bots ou sistema backend
app.use('/api/bots', botRoutes)




// FRONTEND - Rota RAIZ do Site Frontend
app.get('/', (req, res) => { res.redirect('/login')})

// FRONTEND - Pagina para fazer login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'login.html'));
  });

// FRONTEND - Pagina cadastro de usuario
  app.get('/register',(req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'register.html'));
  })

// FRONTEND - Pagina Inicial
app.get('/home', authenticateToken,  (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'home.html'));
})





// Aqui estamos inicializando a api
app.listen(PORT, () => {
    console.log(`O servidor esta ouvindo na porta ${PORT} http://localhost:${PORT}`)
})