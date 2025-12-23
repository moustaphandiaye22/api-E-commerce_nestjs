export interface ICategoriesService {
  findAll(): Promise<any[]>;
  findOne(id: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  remove(id: string): Promise<any>;
  findTree(): Promise<any[]>;
}