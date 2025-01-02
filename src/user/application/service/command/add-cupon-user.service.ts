import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { ICuponRepository } from "src/cupon/domain/repositories/cupon-repository.interface";
import { CuponId } from "src/cupon/domain/value-objects/cupon-id";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { User } from "src/user/domain/user";
import { UserEmail } from "src/user/domain/value-object/user-email";
import { UserImage } from "src/user/domain/value-object/user-image";
import { UserName } from "src/user/domain/value-object/user-name";
import { UserPhone } from "src/user/domain/value-object/user-phone";
import { UserRole } from "src/user/domain/value-object/user-role";
import { AddCuponUserServiceEntryDto } from "../../DTO/params/add-cupon-user-service-entry.dto";

export class AddCuponUserService implements IApplicationService<AddCuponUserServiceEntryDto, string> {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly cuponRepository: ICuponRepository
    ) { }

    async execute(data: AddCuponUserServiceEntryDto): Promise<Result<string>> {
        const find_user = await this.userRepository.findUserById(data.userId)
        if (!find_user.isSuccess())
            return Result.fail(find_user.Error, find_user.StatusCode, find_user.Message)

        const find_cupon = await this.cuponRepository.findCuponByCode(data.code)
        if (!find_cupon.isSuccess())
            return Result.fail(find_cupon.Error, find_cupon.StatusCode, find_cupon.Message)

        const cupones = find_user.Value.Cupons
        cupones.push(find_cupon.Value.Id)

        const user = User.createWithCupons(
            find_user.Value.Id,
            UserName.create(find_user.Value.Name),
            UserPhone.create(find_user.Value.Phone),
            UserEmail.create(find_user.Value.Email),
            UserImage.create(find_user.Value.Image),
            UserRole.create(find_user.Value.Role),
            cupones
        )

        const save = await this.userRepository.saveUserAggregate(user)

        if(!save.isSuccess())
            return Result.fail(save.Error,save.StatusCode,save.Message)

        return Result.success('Agregado el cupon',200)

    }
    get name(): string {
        return this.constructor.name
    }

}