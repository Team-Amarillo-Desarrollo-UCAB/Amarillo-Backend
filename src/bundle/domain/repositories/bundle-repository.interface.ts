import { Result } from 'src/common/domain/result-handler/Result';
import { Bundle } from '../bundle.entity';

//esto es un puerto y habran adapters en infraestructura
export interface IBundleRepository {
    findAllBundles(page: number, limit: number, category?:string[], name?:string, price?:number, popular?:string, discount?:string): Promise<Result<Bundle[]>>;

    addBundle(bundle:Bundle): Promise<Result<Bundle>>;

    
    findBundleById(id: string): Promise<Result<Bundle>>;

    
    findBundleByName(name: string): Promise<Result<Bundle>>

    updateBundle(b:Bundle):Promise<Result<Bundle>>

    deleteBundle(id:string):Promise<Result<Bundle>>
}
