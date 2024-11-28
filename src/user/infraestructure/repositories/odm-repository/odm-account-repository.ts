import { Result } from "src/common/domain/result-handler/Result"
import { UserNotFoundException } from "../../exceptions/user-not-found-exception";
import { Model } from "mongoose";
import { IAccountRepository } from "src/user/application/interface/account-user-repository.interface";
import { OdmUserEntity } from "../../entities/odm-entities/odm-user.entity";

export class OdmAccountRepository implements IAccountRepository<OdmUserEntity> {

    private readonly userModel: Model<OdmUserEntity>

    constructor(userModel: Model<OdmUserEntity>){
        this.userModel = userModel
    }

    async updateUserPassword(email: string, newPassword: string): Promise<Result<boolean>> {
        try {
            await this.userModel.findOneAndUpdate( { email: email }, { password: newPassword } )
            return Result.success<boolean>( true, 200 )
        } catch (error) {
            return Result.fail<boolean>( error, 500, "Error al cambiar contraseña" )
        }
    }

    async findAllUsers(): Promise<Result<OdmUserEntity[]>> {
        try{
            const user: OdmUserEntity[] = await this.userModel.find().exec()
            if (user){
                return Result.success<OdmUserEntity[]>(user,200)
            }
            return Result.fail<OdmUserEntity[]>(new UserNotFoundException(), 403, "User not founded")
        } catch(error){
            return Result.fail<OdmUserEntity[]>( error, 500, "Error al buscar usuarios" )
        }
    }

    async saveUser(user: OdmUserEntity): Promise<Result<boolean>> {
        try { 
            const result = await this.userModel.create(user)
            if(!result) return Result.success<boolean>(true,200)
            return Result.success<boolean>(true, 200)
        } catch (error) {
            return Result.fail<boolean>( error, 500, "Error registrando usuario" )
        }
    }

    async findUserById(userId: string): Promise<Result<OdmUserEntity>> {
        try{
            const user = await this.userModel.findOne( { id: userId } )
            if (user){
                return Result.success<OdmUserEntity>(user,200)
            }
            return Result.fail<OdmUserEntity>(new UserNotFoundException(), 403, "User not founded")
        } catch(error){
            return Result.fail<OdmUserEntity>( error, 500, "Error al buscar usuario" )
        }
    }

    async findUserByEmail(email: string): Promise<Result<OdmUserEntity>> {
        try{
            const user = await this.userModel.findOne( { email: email } )
            if (user) return Result.success<OdmUserEntity>(user,200)
            return Result.fail<OdmUserEntity>(new UserNotFoundException(), 403, "User not founded")
        } catch(error){
            return Result.fail<OdmUserEntity>( error, 500, "Error al buscar usuario" )
        }
    }

}