const bcrypt = require('bcrypt');
const { Usuario } = require('../models');
const jwt = require('jsonwebtoken')

const AuthController = {
    login: async (req, res) => {
        const {email, senha} = req.body;

        // Encontrar usuario
        const usuario = await Usuario.findOne({where:{email}});

        // Verificar usuário
        if(!usuario) {
            return res.status(403).json({error: "Login Inválido"});
        };
        
        // Verificar senha
        if(!bcrypt.compareSync(senha, usuario.senha)){
            return res.status(403).json({error: "Login Inválido"});
        };

        // Removendo a Senha
        usuario.senha = undefined;

        // Cria token
        let token = jwt.sign({usuario},"segredo");

        return res.status(200).json({usuario, token});
    }
};

module.exports = AuthController;