import { response, request } from "express";
import Users from '../users/user.model.js';
import bcryptjs from 'bcryptjs';
import { verificarEmail } from "../middlewares/auth-validators.js";
import { generarJWT } from "../helpers/generar-jwt.js";

export const userLogi = async (req = request, res = response) => {
    const { email, password } = req.body;

    try {
        let user = null;

        if (email) {
            user = await Users.findOne({ email });
        } else{
            return res.status(500).json({
                msg: '|| DEBE PROPORCIONAR UN CORREO VALIDO ||'
            });
        }

        if (!user) {
            return res.status(400).json({
                msg: '|| USUARIO NO ENCONTRADO COMPAÑERO, PROBABLEMENTE NO INGRESAS UN USUARIO CON DOMINIO @ORG.GT O @KINAL.EDU.GT ||'
            });
        }

        const validPassword = await bcryptjs.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: '|| CLAVE INCORRECTA, INGRESELA BIEN PAPITO:V'
            });
        }

        //Aqui el token
        const token = await generarJWT(user.id);

        return res.status(200).json({
            msg: '|| BIENVENIDO AL GESTOR DE COMPRAS BRO ||',
            user,
            token
        });

    } catch (error) {
        console.log('Error al logearse: ', error);
        res.status(400).json({
            error: error.message
        });
    }
}