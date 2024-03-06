import jwt from 'jsonwebtoken';
import Admin from '../users/user.model.js'

export const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: "|| NO HAY TOKEN EN LA SOLICITUD ||",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const admin = await Admin.findById(decoded.uid);

        if (!admin) {
            return res.status(401).json({
                msg: '|| EL USUARIO NO TA EN LA BASE DE DATOS BRO:V'
            });
        }

        if (!admin.userState) {
            return res.status(401).json({
                msg: '|| TOKEN INVALIDO USUARIO CON ESTADO: FALSE ||'
            });
        }

        req.admin = admin;

        next();

    } catch (error) {
        console.error('Error al verificar el token JWT:', error);
        return res.status(401).json({
            msg: "Token JWT no válido",
        });
    }

}