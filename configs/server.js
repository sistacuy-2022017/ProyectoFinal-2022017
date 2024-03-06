"use strict";

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnectionFinal } from './mongo.js';
import UsersRoutes from '../src/users/user.routes.js';
import authenRoutes from '../src/auth/auth.routes.js';
import catRoutes from '../src/categorias/category.routes.js';
import prodcRoutes from '../src/product/product.routes.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/FinalApi/v1/users';
        this.authenticPath = '/FinalApi/v1/auth';
        this.catePath = '/FinalApi/v1/cate';
        this.prdCath = '/FinalApi/v1/prod';
        this.middlewares();
        this.conectarDBInsanaFinal();
        this.routes();
    }

    async conectarDBInsanaFinal() {
        await dbConnectionFinal();
    }

    middlewares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.usersPath, UsersRoutes);
        this.app.use(this.authenticPath, authenRoutes);
        this.app.use(this.catePath, catRoutes);
        this.app.use(this.prdCath, prodcRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port', this.port);
        });
    }
}

export default Server;