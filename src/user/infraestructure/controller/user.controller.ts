import { Controller, Get, Inject, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { DataSource } from "typeorm";

import { OrmUserRepository } from "../repositories/orm-repositories/orm-user-repository";
import { UserMapper } from "../mappers/orm-mapper/user-mapper";
import { Body, Logger, Put, UseGuards } from '@nestjs/common'
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
import { userUpdateEntryInfraestructureDto } from "src/user/infraestructure/DTO/entry/user-update-entry-infraestructure";
import { UpdateUserProfileSwaggerResponseDto } from "src/user/infraestructure/DTO/response/update-user-profile-swagger-response.dto";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { OrmAccountRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-account-repository";
import { UpdateUserProfileInfraServiceEntryDto } from "src/user/infraestructure/services/DTO/update-user-profile-infra-service-entry-dto";
import { UpdateUserProfileInfraService } from "src/user/infraestructure/services/update-user-profile-infra.service";
import { RabbitEventBus } from "src/common/infraestructure/rabbit-event-handler/rabbit-event-handler";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { CloudinaryFileUploader } from "src/common/infraestructure/cloudinary-file-uploader/cloudinary-file-uploader";
import { LoggingDecorator } from "src/common/application/application-services/decorators/logging-decorator/logging.decorator";
import { NativeLogger } from "src/common/infraestructure/logger/logger";
import { ICuponRepository } from "src/cupon/domain/repositories/cupon-repository.interface";
import { CuponRepository } from "src/cupon/infraestructure/repositories/cupon-repository";
import { CuponMapper } from "src/cupon/infraestructure/mappers/cupon-mapper";
import { AddCuponUserServiceEntryDto } from "src/user/application/DTO/params/add-cupon-user-service-entry.dto";
import { ExceptionDecorator } from "src/common/application/application-services/decorators/exception-decorator/exception.decorator";
import { PerformanceDecorator } from "src/common/application/application-services/decorators/performance-decorator/performance-decorator";
import { AddCuponUserService } from "src/user/application/service/command/add-cupon-user.service";
import { HttpExceptionHandler } from "src/common/infraestructure/exception-handler/http-exception-handler-code";
import { CurrentUserSwaggerResponseDto } from "src/auth/infraestructure/DTO/response/current-user-swagger-response.dto";


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
  private readonly cuponRepository: ICuponRepository
  private readonly eventBus = RabbitEventBus.getInstance();

  constructor(
    @Inject('DataSource') private readonly dataSource: DataSource,
  ) {
    this.idGenerator = new UuidGenerator()
    this.imageTransformer = new ImageTransformer()
    this.fileUploader = new CloudinaryFileUploader()
    this.userRepository = new OrmUserRepository(new UserMapper(), dataSource)
    this.encryptor = new EncryptorBcrypt()
    this.ormAccountRepository = new OrmAccountRepository(dataSource)
    this.cuponRepository = new CuponRepository(new CuponMapper(), dataSource)
  }


  @Patch('update')
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
      new ExceptionDecorator(
        new LoggingDecorator(
          new PerformanceDecorator(
            new UpdateUserProfileAplicationService(
              this.userRepository, eventBus
            ),
            new NativeLogger(this.logger),
          ),
          new NativeLogger(this.logger),
        ), new HttpExceptionHandler()
      );

    const resultUpdate = (await updateUserProfileService.execute(userUpdateDto))

    const updateUserProfileInfraService =
      new ExceptionDecorator(
        new LoggingDecorator(
          new PerformanceDecorator(
            new UpdateUserProfileInfraService(
              this.ormAccountRepository,
              this.idGenerator,
              this.encryptor,
              this.fileUploader
            ),
            new NativeLogger(this.logger),
          ),
          new NativeLogger(this.logger),
        ),
        new HttpExceptionHandler(),
      );

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

  // @Post('add/cupon/:code')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOkResponse({
  //   description:
  //     'Agregar un cupon a la lista de cupones de un usuario',
  //   type: UpdateUserProfileSwaggerResponseDto,
  // })
  // async addCupon(@GetUser() user, @Param('code') code: string) {
  //   const data: AddCuponUserServiceEntryDto = {
  //     userId: user.id,
  //     code: code
  //   }

  //   const service =
  //     new ExceptionDecorator(
  //       new PerformanceDecorator(
  //         new LoggingDecorator(
  //           new AddCuponUserService(
  //             this.userRepository,
  //             this.cuponRepository
  //           ),
  //           new NativeLogger(this.logger)
  //         ),
  //         new NativeLogger(this.logger)
  //       ),
  //       new HttpExceptionHandler()
  //     )

  //   const response = await service.execute(data)

  //   return response
  // }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Obtener usuario por id', type: CurrentUserSwaggerResponseDto })
  @ApiBearerAuth()
  async currentUser(@GetUser() user, @Param('id', ParseUUIDPipe) id: string) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      image: user.image,
      type: user.type
    }
  }
}