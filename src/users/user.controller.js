import { response, request } from "express";
import Users from './user.model.js';
import { verificarUser } from '../middlewares/users-validators.js';
import bcryptjs from 'bcryptjs';

export const usersPost = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const user = new Users({ name, email, password, role });

        const encrip = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, encrip);

        await user.save();

        res.status(200).json({
            msg: '|| Usuario Agregado Insano ||',
            user
        });
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la creación del usuario
        console.error('Error al agregar el usuario: ', error);
        res.status(400).json({ error: error.message });
    }
};