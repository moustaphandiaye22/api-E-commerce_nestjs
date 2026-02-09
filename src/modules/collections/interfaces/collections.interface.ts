export interface ICollectionsService {
  findAll(): Promise<any[]>;
  findOne(id: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  remove(id: string): Promise<any>;
  addProducts(collectionId: string, produitIds: string[]): Promise<any>;
  removeProducts(collectionId: string, produitIds: string[]): Promise<any>;
}
