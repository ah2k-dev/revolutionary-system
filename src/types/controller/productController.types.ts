export interface CreateProductRequest {
  title: string;
  desc: string;
  price: number;
  category: string;
  quantity: number;
  itemWeight: number;
  weightUnit: string;
  size: number[];
  sku: string;
}
