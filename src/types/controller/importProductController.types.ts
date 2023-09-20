export interface UpdateImportProductRequest {
  title: string;
  desc: string;
  price: number;
  category: string;
  quantity: number;
  itemWeight: number;
  weightUnit: string;
  size: number[];
  sku: string;
  // new fields
  profit: number;
  sellingPrice: number;
  shippingPrice: number;
  shippingCountry: string;
  productTag: string[];
  collections: string[];
  variant: string;
}
