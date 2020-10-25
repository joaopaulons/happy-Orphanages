import {Request, Response} from "express";
import {getRepository} from "typeorm";
import * as Yup from 'yup';
import User from "../models/users";
import usersView from '../views/users_view';

export default {
    async index(request: Request, response: Response) {
        const usersRepository = getRepository(User);
        const listall = await usersRepository.find();

        return response.json(usersView.renderMany(listall));
    },

    async registerUser(request: Request, response: Response) {
        const {name, last_name, email, password} = request.body;
        const data = {
            name,
            last_name,
            email,
            password,
        };

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            last_name: Yup.string().required(),
            email: Yup.string().required().email(),
            password: Yup.string().required().min(4).max(20),
        });

        await schema.validate(data, {
            abortEarly: false,
        });

        const user = new User();
        user.name = name;
        user.last_name = last_name;
        user.email = email;
        user.password = password;

        user.hashPassword();
        const userRepository = getRepository(User);

        try {
            const result = await userRepository.save(user);
            return response.status(200).json(usersView.render(result));
        } catch (e) {
            response.status(500).json({'message': e});
            return;
        }
    }
}
