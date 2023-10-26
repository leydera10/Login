import {promises as fs} from 'fs'
import {nanoid} from "nanoid"

import { userModel } from "../models/user.model.js"; 


class UserManager extends userModel
{
    constructor(){
        super();
    }

    async addUser(userData)
    {
        try
        {
            await userModel.create(userData);
            return 'Usuario Agregado';
        } catch (error) {
            console.error('Error al agregar el usuario:', error);
            return 'Error al agregar el usuario';
        }
    }

    async updateUser(id,userData)
    {
        try
        {   
            const user = await UserManager.findOne(id);
            if (!user)
            {
                return 'Usuario no encontrado'
            }
            user.set(userData)
            await user.save();
            return 'usuario actualizado';

        } catch (error) {
            console.error('Error al actualizar el  usuario:', error);
            return 'Error al actualizar el usuario';
        }
    }

    async getUser()
    {
        try
        {   
            const users = await userModel.find({});
            return users;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            return [];
        }    
    }
    

    async getUserById(id)
    {
        try
        {   
            const user = await UserManager.findById(id).lean();
            if (!user)
            {
                return 'Usuario no encontrado'
            }
            
            return user;
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            return 'Error al obtener el usuario';
        }
    }

     
    async deleteUser(id)
    {
        try
        {   
            const user = await UserManager.findById(id);
            if (!user)
            {
                return 'Usuario no encontrado'
            }
            
            await user.remove();
            return 'Usuario Elimninado'
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            return 'Error al eliminar usuario';
        }
    }

    async validateUser(param) {
        try {
          const user = await UserManager.findOne({ email: param });
          if (!user) {
            
            return 'Usuario no encontrado';
          }
          
          return user;
        } catch (error) {
          console.error('Error al validar usuario:', error);
          return 'Error al validar usuario';
        }
      }

      async findUser(email){
        try{
            const user = await UserManager.findOne({email}, {email: 1, first_name: 1, last_name: 1 , rol: 1 });

            if (!user){
                return "User not Found  "
            }

            return user;

        } catch (error) {
            console.log('Error Validating user ', error)
            return 'Error getting user'
        }
      }

      async findEmail(param){
        try{
            const user = await UserManager.findOne(param)
            return user
        } catch (error) {
            console.log('Error getting user ', error)
            return 'Error getting user'
        }
      }
      

}

export default UserManager