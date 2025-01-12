import { Bundle } from "src/bundle/domain/bundle.entity";
import { IBundleRepository } from "src/bundle/domain/repositories/bundle-repository.interface";
import { Result } from "src/common/domain/result-handler/Result";

export class BundleRepositoryMock implements IBundleRepository{

    private readonly bundles: Bundle[] = []
    
    findBundleByName(name: string): Promise<Result<Bundle>> {
        throw new Error("Method not implemented.");
    }
    updateBundle(b: Bundle): Promise<Result<Bundle>> {
        throw new Error("Method not implemented.");
    }
    deleteBundle(id: string): Promise<Result<Bundle>> {
        throw new Error("Method not implemented.");
    }
    

    findAllBundles(page: number, limit: number, category?: string[], name?: string, price?: number, popular?: string, discount?: string): Promise<Result<Bundle[]>> {
        throw new Error("Method not implemented.");
    }
    async addBundle(bundle: Bundle): Promise<Result<Bundle>> {
        const exists = this.bundles.some((b) => b.name.Value === bundle.name.Value);
    
        if (exists) {
          return Result.fail<Bundle>(
            new Error(`Bundle with id ${bundle.Id.Value} already exists`),
            400,
            `Bundle with id ${bundle.Id.Value} already exists`
          );
        }else{
            this.bundles.push(bundle);
            return Result.success<Bundle>(bundle, 200);
        }
    

      }
    

    async createBundle(b:Bundle): Promise<void>{
        this.bundles.push(b)
    }

    async findBundleById(id: string): Promise<Result<Bundle>> {
        const bundle = this.bundles.find(
            (bu) => bu.Id.Value === id
        );
        if (bundle === undefined) {
            return Result.fail<Bundle>(
              new Error(`Bundle with id ${id} not found`),
              404,
              `Bundle with id ${id} not found`,
            );
          }
          return Result.success<Bundle>(bundle, 200);
        }


    }