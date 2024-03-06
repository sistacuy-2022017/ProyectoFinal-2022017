import { response, request } from "express";

export const verificarEmail = (req = request, res = response, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                msg: 'El correo electrónico es requerido'
            });
        }

        // Verificar si el correo electrónico contiene uno de los dominios permitidos
        if (!email.includes("@org.gt") && !email.includes("@kinal.edu.gt")) {
            return res.status(400).json({
                msg: 'Solo se permiten los dominios @org.gt o @kinal.edu.gt'
            });
        }

        // Continuar con la ejecución de la siguiente función middleware
        next();
    } catch (error) {
        return res.status(500).json({
            msg: 'Hubo un error al procesar la solicitud'
        });
    }
};

