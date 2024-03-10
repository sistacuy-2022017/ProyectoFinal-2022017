import userModel from "../users/user.model.js";

export const verificarUser = (req, res, next) => {
    const { email } = req.body;

    let role = null;

    if (email.includes("@org.gt")) {
        role = 'ADMIN';
    } else if (email.includes("@kinal.edu.gt")) {
        role = 'CLIENT';
    } else {
        return res.status(400).json({ error: "El email debe ser de alguno de los siguientes dominios: @org.gt o @kinal.edu.gt" });
    }

    req.body.role = role;
    next();
};


export const existePersonByEmail = async (email = '') => {
    const tituloMin = email.toLowerCase();

    const existeTittle = await userModel.findOne({
        email: {
            $regex: new RegExp(`^${tituloMin}$`, 'i')
        }
    });

    if (existeTittle) {
        throw new Error(`el titulo ${email} ya existe bro`);
    }
}