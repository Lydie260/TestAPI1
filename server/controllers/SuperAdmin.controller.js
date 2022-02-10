import User from '../models/db/usermodel';
import jwtDecode  from 'jwt-decode';
import userModel from '../models/body/user.model';
import validation from '../helpers/validation';
class SuperAdmin {
    static async getAllUsers (req, res){
        const users = await User.find({});
        res.status(200).json({
            status: 200,
            data: users,
        })
    }
    static async changeRoles(req, res){
        const { role } = req.body;
        const { id } = req.query;
        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        const {error} = validation.changeRoleValidation(userModel.changeRole(req));

        if(error){
            return res.status(400).json({
                message: error.details[0].message.replace(/"/g, ''),
            })
        }
        const decodedToken = jwtDecode(token);
        if(decodedToken.user.roles !=='super-admin'){
            return res.status(404).json({
                message: 'Oops you are not allowes to take this action',
            })
        }
        User.findByIdAndUpdate(id, { roles: role}, (err, result) => {
            res.status(201).json({
                message: "woww, you have changed the role of the user",
                user: result
            });
        });
    }
    static async changeStatus(req, res){
        const { status } = req.body;
        const{ id } = req.query;
        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        const decodedToken = jwtDecode(token);
        const {error} = validation.changeStatusValidation(userModel.changeStatus(req));


        if (error){
            return res.status(400).json({
                message: error.details[0].message.replace(/"/g, ''),
                status: 400
            })
        }
        if(decodedToken.user.roles !== 'super-admin'){
            return res.status(403).json({
                message: 'Oops, you are not allowed to take this action ',
                status: 403
            });
        }
        User.findByIdAndUpdate(id, {status: status}, (err, result) =>{
            res.status(201).json({
                message: 'woohooo, you have changed status of the user',
                User: result
            });
        });
    }
    static async deleteUser (req, res){
        const {authorization} = req.headers;
        const token = authorization.split(' ')[1];
        const decodedToken = jwtDecode(token);
        const {error} = validation.deleteUser(userModel.deleteUser(req));


        if (error){
            return res.status(400).json({
                message: error.details[0].message.replace(/"/g, ''),
                status: 400
            })
        
        }
        if(decodedToken.user.roles !== 'super-admin'){
            return res.status(401).json({
                message: 'oops, you are not allowed to take this action! )-:',
                status: 401
            });
        }
     
        const deleted = await User.findByIdAndDelete(req.query.id)
        if(deleted){
            return res.status(202).json({
                status: 202,
                message: `The user is deleted succefully`
            })
        }
    }


    
  
}
export default SuperAdmin;