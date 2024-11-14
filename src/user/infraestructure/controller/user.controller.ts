import { Controller, Inject } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DataSource } from "typeorm";

import { OrmUserRepository } from "../repositories/user-repository";
import { UserMapper } from "../mappers/user-mapper";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";


@ApiTags('User')
@Controller('user')
export class UserController{

    private readonly userRepository: IUserRepository

    constructor(
        @Inject( 'DataSource' ) private readonly dataSource: DataSource 
    ){
        this.userRepository = new OrmUserRepository(new UserMapper(),dataSource)
    }

}