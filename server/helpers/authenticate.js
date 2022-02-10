import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



class authenticate {
    static generateToken(user){
        return jwt.sign({user}, 'testAPI',{expiresIn:'30d'})
    }
    static hashPassword(password){
        return bcrypt.hashSync (password, 10);
    }
    static comparePassword(password, hashedPaword){
        return bcrypt.compareSync(password, hashedPaword)
    }
}
export default authenticate;