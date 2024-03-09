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

export const usersUpdate = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const usuariovalid = req.admin;


    if (usuariovalid.role !== "ADMIN") {
        return res.status(400).json({
            msg: '|| NO PUEDES HACER ESTO PQ NO ERES ADMIN>:(  ||'
        });
    }

    try {
        const user = await Users.findById(id);

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Crear una nueva instancia con los datos actualizados
        const updatedUser = new Users({
            _id: user._id,
            name: name || user.name,
            email: email || user.email,
            password: password || user.password,
            role: role || user.role
        });

        // Hashear la nueva contraseña si se proporcionó
        if (password) {
            const encrip = bcryptjs.genSaltSync();
            updatedUser.password = bcryptjs.hashSync(password, encrip);
        }

        // Comparar los hashes de contraseña
        const passwordsMatch = bcryptjs.compare(user.password, updatedUser.password);

        if (!passwordsMatch) {
            // Actualizar solo el password hash si es diferente
            user.password = updatedUser.password;
            await user.save();
        }

        res.status(200).json({
            msg: 'Usuario actualizado exitosamente',
            user
        });
    } catch (error) {
        console.error('Error al actualizar el usuario: ', error);
        res.status(400).json({ error: error.message });
    }
};

export const eliminarUser = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const usuariovalid = req.admin;

    // Verifica si el usuario válido tiene el rol de administrador
    if (usuariovalid.role !== 'ADMIN') {
        return res.status(403).json({
            msg: 'Solo los administradores pueden eliminar usuarios.'
        });
    }

    const bruh = await Users.findById(usuariovalid.id);

    const encrip = await bcryptjs.compare(password, bruh.password);

    if (!encrip) {
        return res.status(400).json({
            msg: '|| Estás ingresando los datos incorrectamente. ||'
        });
    }
    // Busca y almacena los datos del usuario antes de eliminarlo
    const userToDelete = await Users.findById(id);
    if (!userToDelete) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Realiza la eliminación del usuario especificado por el id
    await Users.findByIdAndUpdate(id, { userState: false });

    res.status(200).json({
        msg: 'Usuario eliminado correctamente.',
        user: userToDelete
    });
}
