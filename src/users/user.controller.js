import { response, request } from "express";
import Users from './user.model.js';
import { verificarUser } from '../middlewares/users-validators.js';
import bcryptjs from 'bcryptjs';

export const usersPost = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Verifica si ya existe algún usuario con el rol ADMIN_ROLE
        const existingAdminUser = await Users.findOne({ role: 'ADMIN' });
        
        if (existingAdminUser) {
            return res.status(400).json({
                error: 'Ya existe un usuario con el rol ADMIN_ROLE. No se puede agregar otro.'
            });
        }

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


export const eliminarUsersAll = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const usuariovalid = req.admin;

    // Si se intenta eliminar el perfil propio del usuario
    if (usuariovalid.id === id) {
        // Verificar la contraseña proporcionada para confirmar la eliminación del perfil
        const userToDelete = await Users.findById(id);
        if (!userToDelete) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const storedPassword = userToDelete.password;

        const encrip = await bcryptjs.compare(password, storedPassword);

        if (!encrip) {
            return res.status(400).json({
                msg: 'La contraseña proporcionada es incorrecta.'
            });
        }

        // Realizar la eliminación del perfil propio del usuario
        await Users.findByIdAndUpdate(id, { userState: false });

        return res.status(200).json({
            msg: 'Perfil eliminado correctamente.'
        });
    }

    // Verificar si el usuario válido tiene el rol de administrador
    if (usuariovalid.role !== 'ADMIN') {
        return res.status(403).json({
            msg: 'Solo los administradores pueden eliminar usuarios.'
        });
    }
};

export const actualizarUsuarioAll = async (req, res) => {
    const { id } = req.params;
    const { password, ...datosUsuario } = req.body;
    const usuarioValido = req.admin;

    try {
        // Verificar si el usuario está intentando actualizar su propio perfil
        if (usuarioValido.id === id) {
            // Verificar la contraseña proporcionada para confirmar la actualización del perfil
            const usuarioToUpdate = await Users.findById(id);
            if (!usuarioToUpdate) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }

            const storedPassword = usuarioToUpdate.password;
            const encrip = await bcryptjs.compare(password, storedPassword);

            if (!encrip) {
                return res.status(400).json({
                    msg: 'La contraseña proporcionada es incorrecta.'
                });
            }

            // Actualizar el perfil propio del usuario
            await Users.findByIdAndUpdate(id, datosUsuario);

            // Recuperar los datos actualizados del usuario
            const usuarioActualizado = await Users.findById(id);

            return res.status(200).json({
                msg: 'Perfil actualizado correctamente.',
                usuario: usuarioActualizado
            });
        }

        // Verificar si el usuario válido tiene el rol de administrador
        if (usuarioValido.role !== 'ADMIN') {
            return res.status(403).json({
                msg: 'Solo los administradores pueden actualizar usuarios.'
            });
        }

        // Actualizar el usuario especificado por el ID
        await Users.findByIdAndUpdate(id, datosUsuario);

        // Recuperar los datos actualizados del usuario
        const usuarioActualizado = await Users.findById(id);

        return res.status(200).json({
            msg: 'Usuario actualizado correctamente.',
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({ msg: 'Hubo un error al actualizar el usuario.' });
    }
};

