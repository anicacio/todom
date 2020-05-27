const bcrypt = require('bcrypt');
const { Tarefa } = require('../models');
const jwt = require('jsonwebtoken')

const TarefasController = {
    index: async (req, res) => {
        // res.json(req.headers.authorization);

        // Verificar se existe campo Authorization no header
        if(!req.headers.authorization){
            return res.status(403).json({error: "Token Inválido"});
        }

        // Capturar o token
        let token = req.headers.authorization.substring(7); //substring para tirar o "Bearer "
        
        // Verifica o token
        let decode
        try {
            // Aqui se o segredo for diferente ele dá erro e vai pro catch.
            // Acredito que o segredo é usado só na assinatura, 
            // pois o jwt tem um metodo .decode(token [, options])
            // que decodifica sem validar a assinatura.

            decode = jwt.verify(token,"segredo"); 
        } catch (err) {
            return res.status(403).json({error: "Token Inválido"});
        };
        
        // Encontrar usuário (jwt)
        let usuario = decode.usuario;

        // Encontrar tarefas (model)
        const tarefas = await Tarefa.findAll({where:{usuario_id: usuario.id}});

        // Enviar as tarefas com req.status(200).json(tarefas)
        return res.status(200).json(tarefas);
    }      
};

module.exports = TarefasController;