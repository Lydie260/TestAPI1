import joi from 'joi';


const registerValidations = (user) =>{
    const schema = joi.object().keys({
        email: joi.string().required().email(),
        names:joi.string().required(),
        password:joi.string().required().min(6)
    })
    return schema.validate(user);
}


const loginValidation = (user) =>{
    const schema = joi.object().keys({
        email: joi.string().required().email(),
        password: joi.string().required(),
    })
    return schema.validate(user);
}



const changeRoleValidation = (user) =>{
    const schema = joi.object().keys({
        role: joi.string().required(),
    })
    return schema.validate(user);
}



const changeStatusValidation = (user) =>{
    const schema = joi.object().keys({
        status: joi.string().required(),

    })
    return schema.validate(user);
}
const deleteUser= (user) =>{
    const schema = joi.object().keys({
        _id: joi.string().required(),
    })
    return schema.validate(user);
}


export default {registerValidations,loginValidation, changeRoleValidation, changeStatusValidation, deleteUser};
