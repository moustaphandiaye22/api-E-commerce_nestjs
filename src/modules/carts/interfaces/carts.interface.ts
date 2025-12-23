export interface ICartsService {
  getCart(userId: string): Promise<any>;
  addItem(userId: string, productId: string, quantity: number, variantId?: string): Promise<any>;
  updateItem(cartItemId: string, quantity: number): Promise<any>;
  removeItem(cartItemId: string): Promise<any>;
  clearCart(userId: string): Promise<void>;
  getCartTotal(userId: string): Promise<number>;
}