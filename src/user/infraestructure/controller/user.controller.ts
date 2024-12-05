import { Controller, Inject, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { DataSource } from "typeorm";

import { OrmUserRepository } from "../repositories/orm-repositories/orm-user-repository";
import { UserMapper } from "../mappers/orm-mapper/user-mapper";
import {Body, Logger, Put, UseGuards} from '@nestjs/common'
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator";
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard";
import { IEncryptor } from "src/common/application/encryptor/encryptor.interface";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { EncryptorBcrypt } from "src/common/infraestructure/encryptor/encryptor-bcrypt";
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator";
import { ImageTransformer } from "src/common/infraestructure/image-helper/image-transformer";
import { UpdateUserProfileServiceEntryDto } from "src/user/application/dto/params/update-user-profile-service-entry.dto";
import { IAccountRepository } from "src/user/application/interface/account-user-repository.interface";
import { UpdateUserProfileAplicationService } from "src/user/application/service/command/update-user-profile.application.service";
import { userUpdateEntryInfraestructureDto } from "../dto/entry/user-update-entry-infraestructure";
import { UpdateUserProfileSwaggerResponseDto } from "../dto/response/update-user-profile-swagger-response.dto";
import { OrmUser } from "../entities/orm-entities/user.entity";
import { OrmAccountRepository } from "../repositories/orm-repositories/orm-account-repository";
import { UpdateUserProfileInfraServiceEntryDto } from "../services/dto/update-user-profile-infra-service-entry-dto";
import { UpdateUserProfileInfraService } from "../services/update-user-profile-infra.service";
import { RabbitEventBus } from "src/common/infraestructure/rabbit-event-handler/rabbit-event-handler";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { CloudinaryFileUploader } from "src/common/infraestructure/cloudinary-file-uploader/cloudinary-file-uploader";
import { LoggingDecorator } from "src/common/application/application-services/decorators/logging-decorator/logging.decorator";
import { NativeLogger } from "src/common/infraestructure/logger/logger";


//UserMapper
@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly userRepository: OrmUserRepository
  private readonly logger: Logger = new Logger("UserController")
  private readonly imageTransformer: ImageTransformer
  private readonly fileUploader: IFileUploader
  private readonly idGenerator: IdGenerator<string>
  private readonly encryptor: IEncryptor
  private readonly ormAccountRepository: IAccountRepository<OrmUser>
  private readonly eventBus = RabbitEventBus.getInstance();
    
  constructor(
    @Inject('DataSource') private readonly dataSource: DataSource,
  ) {
    this.idGenerator = new UuidGenerator()
    this.imageTransformer = new ImageTransformer()
    this.fileUploader = new CloudinaryFileUploader()
    this.userRepository = new OrmUserRepository(new UserMapper(), dataSource)
    this.encryptor = new EncryptorBcrypt()
    this.ormAccountRepository = new OrmAccountRepository( dataSource )
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
    // let image: File = null
    // if (updateEntryDTO.image) image = await this.imageTransformer.base64ToFile(updateEntryDTO.image)
    
    const userUpdateDto: UpdateUserProfileServiceEntryDto = { userId: user.id, ...updateEntryDTO }
    const updateUserProfileService = 
    //   new ExceptionDecorator(
         new LoggingDecorator(
    //       new PerformanceDecorator(
            new UpdateUserProfileAplicationService(
              this.userRepository, eventBus
            ),
             new NativeLogger(this.logger),
        //   ),
        //   new NativeLogger(this.logger),
        // ), new HttpExceptionHandler()
    );

    const resultUpdate = (await updateUserProfileService.execute(userUpdateDto))
    
    const updateUserProfileInfraService =
    //   new AuditingDecorator(
    //     new ExceptionDecorator(
    //       new LoggingDecorator(
    //         new PerformanceDecorator(
              new UpdateUserProfileInfraService(
                this.ormAccountRepository,
                this.idGenerator,
                this.encryptor,
                this.fileUploader
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
        image: updateEntryDTO.image,
      }
      const updateInfraResult = await updateUserProfileInfraService.execute(userInfraUpdateDto)
      if (!updateInfraResult.isSuccess()) return updateInfraResult.Error
      const Respuesta: UpdateUserProfileSwaggerResponseDto = { Id: updateInfraResult.Value.userId }
      return Respuesta
    }
    return { Id: resultUpdate.Value.userId }
  }
}