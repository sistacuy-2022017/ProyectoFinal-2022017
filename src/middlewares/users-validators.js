import userModel from "../users/user.model.js";

export const verificarUser = async (role = '') => {
    const { email } = req.body;

    // Si el correo contiene "@org.gt", asigna "ADMIN"
    if (email && email.includes("@org.gt")) {
        req.body.role = 'ADMIN';
    }else if(email && email.includes("@kinal.edu.gt")){
        req.body.role = 'CLIENT'
    }else{
        throw new Error("el email debe ser de alguno de los siguientes dominios @org.gt o @kinal.edu.gt")
    }

    next();
}
