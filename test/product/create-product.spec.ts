import { UserObjectMother } from "test/common/objects-mock/user.object-mother";
import { UserMockRepository } from "test/common/repository-mock/user-repository-mock";

describe('Create product', () => {

    it('should create a new product', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
    })

})