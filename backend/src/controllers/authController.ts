import {Request, Response} from "express";
import {getRepository} from "typeorm";
import * as jwt from "jsonwebtoken";
import User from "../models/users";
import Config from "../config/configs";
import * as Yup from 'yup';
import config from "../config/configs";

export default {
    async login(request: Request, response: Response) {
        let {email, password} = request.body;

        const data = {
            email,
            password,
        };

        const schema = Yup.object().shape({
            email: Yup.string().required().email(),
            password: Yup.string().required(),
        });

        await schema.validate(data, {
            abortEarly: false,
        });


        //Get user from database
        const userRepository = getRepository(User);

        const user = await userRepository.findOneOrFail({where: {email}});

        //Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            response.status(401).json({
                'message': 'Password incorrect'
            });
            return;
        }

        //Sing JWT, valid for 1 hour
        const token = jwt.sign(
            {userId: user.id, username: user.email},
            Config.jwtSecret,
            {expiresIn: "1h"}
        );

        //Send the jwt in the response
        return response.status(200).json({
            'token': token,
            'expiresIn': "1hr"
        });
    },

    async changePassword(request: Request, response: Response) {
        const token = <string>request.headers.authorization?.split(' ')[1];

        let jwtPayload;

        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        let id = jwtPayload.userId;
        //Get parameters from the body
        const {oldPassword, newPassword} = request.body;

        const data = {
            oldPassword,
            newPassword
        };

        const schema = Yup.object().shape({
            oldPassword: Yup.string().required().min(4).max(20),
            newPassword: Yup.string().required().min(4).max(20),
        });

        await schema.validate(data, {
            abortEarly: false,
        });

        //Get user from the database
        const userRepository = getRepository(User);
        let user: User;
        user = await userRepository.findOneOrFail(id);

        //Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            response.status(401).send({message: 'Old password is different'});
            return;
        }

        //Validate de model (password lenght)
        user.password = newPassword;

        //Hash the new password and save
        user.hashPassword();
        await userRepository.save(user);

        response.status(204).json({
            message: 'Success!'
        });
    }

}
