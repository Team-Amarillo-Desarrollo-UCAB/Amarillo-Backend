import { UpdateCategoryServiceResponseDto } from "../dto/response/update-category-service-response.dto";
import { Result } from "src/common/domain/result-handler/Result";
import { ICategoryRepository } from "src/category/domain/repositories/category-repository.interface";
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { CategoryName } from "src/category/domain/value-objects/category-name";
import { CategoryImage } from "src/category/domain/value-objects/category-image";
import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { UpdateCategoryServiceEntryDto } from "../dto/entry/update-category-service-entry.dto";

export class UpdateCategoryApplicationService implements IApplicationService<UpdateCategoryServiceEntryDto,UpdateCategoryServiceResponseDto>{
    
    private readonly categoryRepository: ICategoryRepository
    private readonly eventHandler: IEventHandler

    constructor ( 
        categoryRepository: ICategoryRepository,
        eventHandler: IEventHandler
    ){
        this.categoryRepository = categoryRepository
        this.eventHandler = eventHandler
    }
    
    async execute(data: UpdateCategoryServiceEntryDto): Promise<Result<UpdateCategoryServiceResponseDto>> {

        // Hay que tener certeza que el nombre de la categoría no coincida con una de la BD

        console.log("Valor de data.name:",data.name)
        console.log("Valor de data.image:",data.icon)

        if(data.name){
            const verifyName = await this.categoryRepository.findCategoryByName(data.name)
            //Caso borde: nombre repetido en la BD
            if(verifyName.isSuccess()) return Result.fail(verifyName.Error,verifyName.StatusCode,verifyName.Message)
        }

        //pendiente ver si validar imagen repetida cloudinary

        const category = await this.categoryRepository.findCategoryById(data.id)

        //caso borde: la categoria que se intenta actualizar no existe en la BD
        if(!category.isSuccess()) return Result.fail<UpdateCategoryServiceResponseDto>(category.Error,category.StatusCode,category.Message)
        
        const categoryResult = category.Value

        categoryResult.pullEvents()//reseteamos los eventos de dominio de la categoría

        //creación de los eventos de dominio pertinentes segun casos de que propiedad actualizar - if's
        if(data.name){
            console.log("Entro al if de data.name")
            categoryResult.updateName(CategoryName.create(data.name))
        } 

        if(data.icon){
            console.log("Updating image to:", data.icon);  // Verificar el valor de la imagen
            categoryResult.updateImage(CategoryImage.create(data.icon))
        } 
    
        console.log("Valor del categoryResult:",categoryResult)
            
        const updateResult = await this.categoryRepository.addCategory(categoryResult)

        if ( !updateResult.isSuccess() ) 
            Result.fail<UpdateCategoryApplicationService>(updateResult.Error, 500, updateResult.Message)
        
        this.eventHandler.publish(categoryResult.pullEvents())
        const respuesta: UpdateCategoryServiceResponseDto = {
            idCategory: updateResult.Value.Id.Value
        }
        return Result.success<UpdateCategoryServiceResponseDto>(respuesta,200)


    }

    get name(): string {
        return this.constructor.name
    }
    
}