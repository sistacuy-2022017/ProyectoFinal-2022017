import jwt from 'jsonwebtoken';
import { token } from 'morgan';

export const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.log('Error al generar el token:', err);
                    reject('No se pudo generar el token');
                } else {
                    console.log('Token generado:', token);
                    resolve(token);
                }
            }
        );
    });
};