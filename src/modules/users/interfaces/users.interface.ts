export interface IUsersService {
  findAll(): Promise<any[]>;
  findOne(id: string): Promise<any>;
  update(id: string, data: any): Promise<any>;
  remove(id: string): Promise<any>;
  createAddress(userId: string, addressData: any): Promise<any>;
  getAddresses(userId: string): Promise<any[]>;
}