class AuthFakeRepository {
    token() {
        return { token: 'token', refreshToken: 'refreshToken' };
    }
}

const authFakeRepository = new AuthFakeRepository();
export { authFakeRepository };
