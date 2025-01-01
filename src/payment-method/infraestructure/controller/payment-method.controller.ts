import { Body, Controller, Get, Inject, Logger, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { DataSource } from "typeorm";

import { PaymentMethodRepository } from "../repositories/payment-method-repository";
import { PaymentMethodMapper } from "../mappers/payment-method-mapper";
import { DisablePaymentMethodEntryDTO } from "../dto/entry/disable-payment-method-entry.dto";
import { CreatePaymentMethodEntryDTO } from "../dto/entry/create-payment-method-entry.dto";
import { CreatePaymentMethodServiceEntryDTO } from "src/payment-method/application/dto/entry/create-payment-method-entry.dto";
import { ExceptionDecorator } from "src/common/application/application-services/decorators/exception-decorator/exception.decorator";
import { LoggingDecorator } from "src/common/application/application-services/decorators/logging-decorator/logging.decorator";
import { PerformanceDecorator } from "src/common/application/application-services/decorators/performance-decorator/performance-decorator";
import { CreatePaymentMethodService } from "src/payment-method/application/command/create-payment-method.service";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator";
import { NativeLogger } from "src/common/infraestructure/logger/logger";
import { ILogger } from "src/common/application/logger/logger.interface";
import { HttpExceptionHandler } from "src/common/infraestructure/exception-handler/http-exception-handler-code";
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto";
import { GetAllPaymentMethodServiceEntryDTO } from "src/payment-method/application/dto/entry/get-all-payment-method-entry.dto";
import { GetAllPaymentMethodService } from "src/payment-method/application/queries/get-all-payment-method.service";
import { GetAllPaymentMethodsResponseDTO } from "../dto/response/get-all-payment-method-response.dto";
import { CreatePaymentMethodResponseDTO } from '../dto/response/create-payment-response.dto';
import { DisablePaymentMethodResponseDTO } from "../dto/response/disable-payment-method-response.dto";
import { DisablePaymentMethodServiceEntryDTO } from 'src/payment-method/application/dto/entry/disable-payment-method-service-entry.dto';
import { DisablePaymentMethodService } from 'src/payment-method/application/command/disable-payment-method.service';

@ApiTags("Payment Method")
@Controller('payment/method')
export class PaymentMethodController {

    private readonly paymentMethodRepository: PaymentMethodRepository
    private readonly idGenerator: IdGenerator<string>
    private readonly logger: Logger = new Logger('ProductController')

    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource
    ) {
        this.paymentMethodRepository = new PaymentMethodRepository(dataSource, new PaymentMethodMapper())
        this.idGenerator = new UuidGenerator()
    }

    @Post('create')
    @ApiOkResponse({
        description: 'Registra un nuevo metodo de pago en la base de datos',
        type: CreatePaymentMethodResponseDTO,
    })
    async createPaymentMethod(
        @Body() request: CreatePaymentMethodEntryDTO
    ) {

        const data: CreatePaymentMethodServiceEntryDTO = {
            userId: '',
            name: request.name,
            active: request.active
        }

        console.log(request)

        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new CreatePaymentMethodService(
                            this.paymentMethodRepository,
                            this.idGenerator
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        return { id_payment_method: result.Value.id_payment_method }

    }

    @Get('many')
    @ApiOkResponse({
        description: 'Obtiene todos los metodos de pagos registrados',
        type: GetAllPaymentMethodsResponseDTO,
        isArray: true
    })
    async getAllPaymentMethods(
        @Query() pagination: PaginationDto
    ) {

        const data: GetAllPaymentMethodServiceEntryDTO = {
            userId: '',
            page: pagination.page,
            limit: pagination.perpage
        }

        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new GetAllPaymentMethodService(
                            this.paymentMethodRepository,
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: GetAllPaymentMethodsResponseDTO[] = []

        for (const r of result.Value) {
            response.push({
                idPayment: r.id_payment,
                name: r.name,
                active: r.active
            })
        }

        return response

    }

    @Post('disable')
    @ApiOkResponse({
        description: 'Obtiene todos los metodos de pagos registrados',
        type: DisablePaymentMethodResponseDTO,
        isArray: true
    })
    async disablePaymentMethod(
        @Body() request: DisablePaymentMethodEntryDTO
    ) {

        const data: DisablePaymentMethodServiceEntryDTO = {
            userId: '',
            ...request
        }

        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new DisablePaymentMethodService(
                            this.paymentMethodRepository,
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        return result.Value

    }

}