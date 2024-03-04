import { response, request } from "express";
import Users from './user.model.js';
import { } from '../middlewares/users-validators.js';

export const usersPost = async (req = request, res = response) => {
    const user = new Users({ name, email, password, role });

    try {
      
        if(role){
            await verificarUser(role);
        }

        await user.save();

        res.status(200).json({
            user
        });
      
    } catch (error) {
        console.error('Error Agregar el usuario: ', error);
        res.status(400).json({ error: error.message });
    }

}