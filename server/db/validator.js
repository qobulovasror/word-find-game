const Joi = require('joi');
const {getRooms, getUser} = require('./index');

const createReqVal = (data) => {
    const validatorSchema = Joi.object({
        roomcode: Joi.string().required().min(6).max(15),
        roomname: Joi.string().required().min(4).max(50),
        questionCount: Joi.string().min(3).max(30),
        execut_time: Joi.string().min(5).max(35),
        username: Joi.string().required().min(3)
    })
    return validatorSchema.validate(data);
}
const createVaidator = async (data) => {
    const valData  = createReqVal(data);
    if(valData.error) return valData;

    // check the existence of user in db
    //check code
    const existDataByCode = await getRooms(null, null, data.roomcode);
    if(existDataByCode) return {error: {details: [{message: 'This Room Code is already exist.'}]}}
    
    //check room name
    const existDataByName = await getRooms(null, data.roomname, null);
    if(existDataByName) return {error: {details: [{message: 'This Room name is already exist.'}]}}
    
    //check username
    const existDataByUsername = await getUser(null, data.username, null);
    if(existDataByUsername) return {error: {details: [{message: 'This User name is already exist.'}]}}
    return {};
}

const joinReqVal = (data) => {
    const joinValidatorSchema = Joi.object({
        username: Joi.string().required().min(3),
        roomcode: Joi.string().required().min(6).max(15)
    })
    return joinValidatorSchema.validate(data);
}
const joinGameValidator = async (data) => {
    const valData  = joinReqVal(data);
    if(valData.error) return valData;

    // check the existence of user in db
    //check code
    const existDataByCode = await getRooms(null, null, data.roomcode);
    if(!existDataByCode) return {error: {details: [{message: 'This Room Code not fount.'}]}}
    
    //check username
    const existDataByUsername = await getUser(null, data.username, null);
    if(existDataByUsername) return {error: {details: [{message: 'This User name is already exist.'}]}}
    return {};
}


module.exports = {
    createVaidator,
    joinGameValidator
}