export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  authorName: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  type: string;
  status: string;
  reviews: Review[];
  averageRating: number;
  rotation?: {
    name: string;
  };
}
