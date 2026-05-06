export interface IMerchant {
  merchantId?: number;
  name: string;
  description?: string;
  logoUrl?: string;
  country: string;
  state: string;
  founder?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  merchantUsers?: IMerchantUser[];
}

export interface IMerchantUser {
  userId: number;
  merchantId: number;
  user?: {
    userId: number;
    email?: string;
    phone?: string;
  };
}

export interface IBranch {
  branchId?: number;
  merchantId?: number;
  categoryId?: number;
  userId?: number; // Manager/User ID
  name: string;
  slug?: string;
  description?: string;
  howItWorks?: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  whatsapp?: string;
  canContact?: boolean;
  messageType?: "contact" | "delivery";
  contactMessage?: string;
  email: string;
  website?: string;
  note?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  images?: string[];
  tags?: string[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  merchant?: {
    merchantId: number;
    name: string;
    description?: string;
    logoUrl?: string;
    country?: string;
    state?: string;
    founder?: boolean;
    createdAt?: string;
  };
  category?: {
    categoryId: number;
    name: string;
    description?: string;
    image?: string;
    slug?: string;
  };
  branchUsers?: {
    branchUserId: number;
    user: {
      userId: number;
      name?: string;
      phone?: string;
      email?: string;
      document?: string;
      documentType?: string;
      role?: {
        roleId: number;
        name: string;
      };
    };
  }[];
  reviews?: any[];
  favorites?: any[];
  offers?: {
    offerType: string;
  }[];
  redemptionsCount?: number;
}
