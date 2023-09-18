export interface CreateProductRequest {
  title: string;
  desc: string;
  // brand: string;
  category: string;
  price: number;
  quantity: number;
  itemWeight: number;
  size: number[];
  sku: string;
}
