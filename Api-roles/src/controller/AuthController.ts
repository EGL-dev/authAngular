import { Response, Request } from 'express'
import { getRepository } from 'typeorm'
import { User } from '../entity/User'
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { validate } from 'class-validator';


class AuthController {
  static login = async (req: Request, res: Response) => {
    
    const { username, password } = req.body;

    if (!(username && password)) {
      return res.status(400).json({ message: "username && password required !" })
      
    }

    const userepostitory = getRepository(User);

    let user: User;


    try {
      user = await userepostitory.findOneOrFail({ where: { username } });

    } catch (error) {
      return res.status(400).json({message:'Username or password incorrecct !'})
  
    }

    //check password

    if (!user.checkpassword(password)) { 
      return res.status(400).json({ message: 'username or password are incorrect !' });
    }

 

    const token = jwt.sign({ userId : user.id, username: user.username }, config.jwtSecret ,{expiresIn:'1h'});

    res.json({
      message: 'OK',
      token
    });
   


  }


  static changePassword = async (req: Request, res: Response) => {
    const { userId } = res.locals.jwtPlayload;
    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword && newPassword)) { 
      res.status(404).json({ message: 'Old password & new password are required' });

    }


    const userRepository = getRepository(User);


    let user: User;

    try {
      user = await userRepository.findOneOrFail(userId);

    } catch (e) {

      res.status(400).json({ message: 'Somenthing goes wrong !' });

      
    }

    if (!user.checkpassword(oldPassword)) { 
      return res.status(403).json({ message: 'check  your old password' });

    }

    user.password = newPassword;
    const errors = await validate(user, { validationError: { target: false, value: false } });
    


    if(errors.length> 0) { 
      return res.status(400).json(errors);
    }
    

//Hash password
    
    user.hashPassword();
    userRepository.save(user);

    res.json({ message: 'Password change' });



  }

  

  


}

export default AuthController