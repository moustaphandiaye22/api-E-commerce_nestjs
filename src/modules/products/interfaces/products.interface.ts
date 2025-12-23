export interface IProductsService {
  findAll(filters?: any): Promise<any>;
  findOne(id: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  remove(id: string): Promise<any>;
  findByCategory(categoryId: string): Promise<any[]>;
  search(query: string): Promise<any[]>;
}