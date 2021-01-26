import { UserController } from './../controller/UserController'
import { Router } from 'express'
import { User } from '../entity/User';
import { checkJwt } from './../middlewares/jwt';
import { checkRole } from '../middlewares/role';



const router = Router();

//Get all user
router.get('/',[checkJwt,checkRole(['admin'])], UserController.getAll);


// Get one user

router.get('/:id',[checkJwt,checkRole(['admin'])], UserController.getById);

//Create new user
router.post('/',[checkJwt,checkRole(['admin'])], UserController.newUser);


//update user
router.patch('/:id', [checkJwt,checkRole(['admin'])],UserController.editUser);


//Delete user 
router.delete('/:id', [checkJwt,checkRole(['admin'])],UserController.deleteUser);





export default router 