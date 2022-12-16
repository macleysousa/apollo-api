import { TokenDTO } from 'src/modules/auth/dto/token.dto';

class AuthFakeRepository {
    token(): TokenDTO {
        return { token: 'token' };
    }
}

const authFakeRepository = new AuthFakeRepository();
export { authFakeRepository };
