export interface IAuthService {
  register(data: any): Promise<any>;
  login(data: any): Promise<any>;
  validateUser(email: string, password: string): Promise<any>;
}