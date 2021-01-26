import {getRepository, getTreeRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { User } from "../entity/User";
import {validate} from 'class-validator'

export class UserController {

    static getAll = async (req: Request, res: Response) => { 
        const userRepository = getRepository(User);
        let user;
        try {
            const user = await userRepository.find();
        } catch (e) {
            res.status(404).json({ message: ' Not result !' });
        }
       

        if (user.length > 0) {
            res.send(user);
        } else { 
            res.status(404).json({ message: ' Not result !' });
            
        }


    }

    static getById = async (req: Request, res: Response) => { 
        const { id } = req.params;
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id);
            res.send(user);

            
        } catch (e) {
            res.status(404).json({message:" No result"})
        }

    }

    static newUser = async (req: Request, res: Response) => {
        const { username, password, role } = req.body;

        const user = new User();
        
        user.username = username;
        user.password = password;
        user.role = role; 


        //validate

        const errors = await validate(user , { validationError: {target:false,value:false}});
        if (errors.length > 0) { 
            return res.status(400).json(errors);

        }


        //hash password 


        const userRepository = getRepository(User);
        try {
            user.hashPassword();
            
            await userRepository.save(user);

        } catch (e) {
            return res.status(404).json({ message: 'Username already exits !' })
            
        }

        //All ok 

        res.send('User created');



    }
    
    static editUser = async (req: Request, res: Response) => { 
        let user;
        const { id } = req.params;
        const { username, role } = req.body;

        const userRepository = getRepository(User);
        try {
            user = await userRepository.findOneOrFail(id);

            user.username = username;
            user.role = role;

            res.send('User modificado');
            

        } catch (e) {
            return res.status(404).json({ message: 'User not found' });
           
            
        }
        
        const errors = await validate(user, { validationError: {target:false,value:false}});

        if (errors.length > 0) { 
            return res.status(400).json(errors);

        }

        try {
            await userRepository.save(user);
        } catch (e) {
            return res.status(409).json({ message: 'Username already in use' });

        }

    }

    static deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = getRepository(User);

        let user : User;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (e) {
            return res.status(404).json({ message: 'User not found' });

        }

        //Remove user 
        userRepository.delete(id);
        res.status(203).json({ message: 'User deleted' });

    }



    

}

export default UserController;