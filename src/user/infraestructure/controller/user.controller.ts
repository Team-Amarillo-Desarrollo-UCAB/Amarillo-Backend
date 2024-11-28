import { Controller, Inject } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { DataSource } from "typeorm";

import { OrmUserRepository } from "../repositories/orm-repositories/orm-user-repository";
import { UserMapper } from "../mappers/orm-mapper/user-mapper";
import {Body, Logger, Put, UseGuards} from '@nestjs/common'
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator";
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard";
import { IEncryptor } from "src/common/application/encryptor/encryptor.interface";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { EncryptorBcrypt } from "src/common/infraestructure/encryptor/encryptor-bcrypt";
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator";
import { ImageTransformer } from "src/common/infraestructure/image-helper/image-transformer";
import { UpdateUserProfileServiceEntryDto } from "src/user/application/DTO/params/update-user-profile-service-entry.dto";
import { IAccountRepository } from "src/user/application/interface/account-user-repository.interface";
import { UpdateUserProfileAplicationService } from "src/user/application/service/command/update-user-profile.application.service";
import { UserEmailModified } from "src/user/domain/events/user-email-modified-event";
import { UserNameModified } from "src/user/domain/events/user-name-modified-event";
import { UserPhoneModified } from "src/user/domain/events/user-phone-modified-event";
import { userUpdateEntryInfraestructureDto } from "../DTO/entry/user-update-entry-infraestructure";
import { UpdateUserProfileSwaggerResponseDto } from "../DTO/response/update-user-profile-swagger-response.dto";
import { OdmUserEntity } from "../entities/odm-entities/odm-user.entity";
import { OrmUser } from "../entities/orm-entities/user.entity";
import { UserQuerySynchronizer } from "../query-synchronizer/user-query-synchronizer";
import { OdmAccountRepository } from "../repositories/odm-repository/odm-account-repository";
import { OdmUserRepository } from "../repositories/odm-repository/odm-user-repository";
import { OrmAccountRepository } from "../repositories/orm-repositories/orm-account-repository";
import { UpdateUserProfileInfraServiceEntryDto } from "../services/DTO/update-user-profile-infra-service-entry-dto";
import { UpdateUserProfileInfraService } from "../services/update-user-profile-infra.service";
import { RabbitEventBus } from "src/common/infraestructure/rabbit-event-handler/rabbit-event-handler";


//UserMapper
@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly odmUserRepository: OdmUserRepository
  private readonly userRepository: OrmUserRepository
  private readonly logger: Logger = new Logger("UserController")
  private readonly imageTransformer: ImageTransformer
  private readonly idGenerator: IdGenerator<string>
  private readonly encryptor: IEncryptor
  private readonly userQuerySyncronizer: UserQuerySynchronizer
  private readonly odmAccountRepository: IAccountRepository<OdmUserEntity>
  private readonly ormAccountRepository: IAccountRepository<OrmUser>
    
  constructor(
    @Inject('DataSource') private readonly dataSource: DataSource,
    @InjectModel('User') private userModel: Model<OdmUserEntity>
  ) {
    this.odmUserRepository = new OdmUserRepository(userModel)
    this.encryptor = new EncryptorBcrypt()
    this.userRepository = new OrmUserRepository(new UserMapper(), dataSource)
    this.imageTransformer = new ImageTransformer()
    this.idGenerator = new UuidGenerator()
    this.userQuerySyncronizer = new UserQuerySynchronizer(this.odmUserRepository, userModel)

    this.ormAccountRepository = new OrmAccountRepository( dataSource )
    this.odmAccountRepository = new OdmAccountRepository( userModel )

  }

  @Put('update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description:
      'Modificar dato/s de registro de un usuario, dado el id del usuario',
    type: UpdateUserProfileSwaggerResponseDto,
  })
  async updateUser(@GetUser() user, @Body() updateEntryDTO: userUpdateEntryInfraestructureDto) {
    const eventBus = RabbitEventBus.getInstance()
    let image: File = null
    
    if (updateEntryDTO.image) image = await this.imageTransformer.base64ToFile(updateEntryDTO.image)

    if (updateEntryDTO.email) 
      eventBus.subscribe('UserEmailModified', async (event: UserEmailModified) => {
        await this.userQuerySyncronizer.execute(event)
      })

    if (updateEntryDTO.name) 
      eventBus.subscribe('UserNameModified', async (event: UserNameModified) => {
        await this.userQuerySyncronizer.execute(event)
      })
      
    if (updateEntryDTO.phone) 
      await eventBus.subscribe('UserPhoneModified', async (event: UserPhoneModified) => {
        await this.userQuerySyncronizer.execute(event);
      })
    
    const userUpdateDto: UpdateUserProfileServiceEntryDto = { userId: user.id, ...updateEntryDTO }

    const updateUserProfileService = 
    //   new ExceptionDecorator(
    //     new LoggingDecorator(
    //       new PerformanceDecorator(
            new UpdateUserProfileAplicationService(
              this.userRepository, eventBus
            );
        //     new NativeLogger(this.logger),
        //   ),
        //   new NativeLogger(this.logger),
        // ), new HttpExceptionHandler()
    //);

    const resultUpdate = (await updateUserProfileService.execute(userUpdateDto))
    
    const updateUserProfileInfraService =
    //   new AuditingDecorator(
    //     new ExceptionDecorator(
    //       new LoggingDecorator(
    //         new PerformanceDecorator(
              new UpdateUserProfileInfraService(
                this.ormAccountRepository,
                this.odmAccountRepository,
                this.idGenerator,
                this.encryptor
              );
    //           new NativeLogger(this.logger),
    //         ),
    //         new NativeLogger(this.logger),
    //       ),
    //       new HttpExceptionHandler(),
    //     ),
    //     this.auditingRepository,
    //     this.idGenerator
    //   );

    if (updateEntryDTO.password || updateEntryDTO.image) {
      const userInfraUpdateDto: UpdateUserProfileInfraServiceEntryDto = {
        userId: user.id,
        password: updateEntryDTO.password,
        image: image
      }
      const updateInfraResult = await updateUserProfileInfraService.execute(userInfraUpdateDto)
      if (!updateInfraResult.isSuccess()) return updateInfraResult.Error
      const Respuesta: UpdateUserProfileSwaggerResponseDto = { Id: updateInfraResult.Value.userId }
      return Respuesta
    }
    return { Id: resultUpdate.Value.userId }
  }
}