import type {
  AllBranchesResponse,
  BranchResponse,
} from "../interfaces/branches.response.interface";

export const createBranchResponseAdapter = (data: any): BranchResponse => {
  return {
    message: data.message || "Sucursal creada exitosamente",
    branch: {
      branchId: data.branch?.branchId,
      merchantId: data.branch?.merchantId,
      categoryId: data.branch?.categoryId,
      name: data.branch?.name,
      slug: data.branch?.slug,
      description: data.branch?.description,
      howItWorks: data.branch?.howItWorks,
      address: data.branch?.address,
      city: data.branch?.city,
      country: data.branch?.country,
      latitude: data.branch?.latitude,
      longitude: data.branch?.longitude,
      phone: data.branch?.phone,
      email: data.branch?.email,
      website: data.branch?.website,
      note: data.branch?.note,
      logoUrl: data.branch?.logoUrl,
      coverImageUrl: data.branch?.coverImageUrl,
      images: data.branch?.images,
      tags: data.branch?.tags,
      isActive: data.branch?.isActive,
      createdAt: data.branch?.createdAt
        ? new Date(data.branch.createdAt)
        : undefined,
      updatedAt: data.branch?.updatedAt
        ? new Date(data.branch.updatedAt)
        : undefined,
      merchant: data.branch?.merchant,
      category: data.branch?.category,
    },
  };
};

export const updateBranchResponseAdapter = (data: any): BranchResponse => {
  return {
    message: data.message || "Sucursal actualizada exitosamente",
    branch: {
      branchId: data.branch?.branchId,
      merchantId: data.branch?.merchantId,
      categoryId: data.branch?.categoryId,
      name: data.branch?.name,
      slug: data.branch?.slug,
      description: data.branch?.description,
      howItWorks: data.branch?.howItWorks,
      address: data.branch?.address,
      city: data.branch?.city,
      country: data.branch?.country,
      latitude: data.branch?.latitude,
      longitude: data.branch?.longitude,
      phone: data.branch?.phone,
      email: data.branch?.email,
      website: data.branch?.website,
      note: data.branch?.note,
      logoUrl: data.branch?.logoUrl,
      coverImageUrl: data.branch?.coverImageUrl,
      images: data.branch?.images,
      tags: data.branch?.tags,
      isActive: data.branch?.isActive,
      createdAt: data.branch?.createdAt
        ? new Date(data.branch.createdAt)
        : undefined,
      updatedAt: data.branch?.updatedAt
        ? new Date(data.branch.updatedAt)
        : undefined,
      merchant: data.branch?.merchant,
      category: data.branch?.category,
    },
  };
};

export const allBranchesResponseAdapter = (data: any): AllBranchesResponse => {
  return {
    branches:
      data.branches?.map((branch: any) => ({
        branchId: branch.branchId,
        merchantId: branch.merchantId,
        categoryId: branch.categoryId,
        name: branch.name,
        slug: branch.slug,
        description: branch.description,
        howItWorks: branch.howItWorks,
        address: branch.address,
        city: branch.city,
        country: branch.country,
        latitude: branch.latitude,
        longitude: branch.longitude,
        phone: branch.phone,
        email: branch.email,
        website: branch.website,
        note: branch.note,
        logoUrl: branch.logoUrl,
        coverImageUrl: branch.coverImageUrl,
        images: branch.images,
        tags: branch.tags,
        isActive: branch.isActive,
        createdAt: branch.createdAt ? new Date(branch.createdAt) : undefined,
        updatedAt: branch.updatedAt ? new Date(branch.updatedAt) : undefined,
        merchant: branch.merchant,
        category: branch.category,
      })) || [],
    count: data.count || 0,
  };
};

export const getBranchResponseAdapter = (data: any): BranchResponse => {
  return {
    message: "Sucursal obtenida exitosamente",
    branch: {
      branchId: data.branch?.branchId,
      merchantId: data.branch?.merchantId,
      categoryId: data.branch?.categoryId,
      name: data.branch?.name,
      slug: data.branch?.slug,
      description: data.branch?.description,
      howItWorks: data.branch?.howItWorks,
      address: data.branch?.address,
      city: data.branch?.city,
      country: data.branch?.country,
      latitude: data.branch?.latitude,
      longitude: data.branch?.longitude,
      phone: data.branch?.phone,
      email: data.branch?.email,
      website: data.branch?.website,
      note: data.branch?.note,
      logoUrl: data.branch?.logoUrl,
      coverImageUrl: data.branch?.coverImageUrl,
      images: data.branch?.images,
      tags: data.branch?.tags,
      isActive: data.branch?.isActive,
      createdAt: data.branch?.createdAt
        ? new Date(data.branch.createdAt)
        : undefined,
      updatedAt: data.branch?.updatedAt
        ? new Date(data.branch.updatedAt)
        : undefined,
      merchant: data.branch?.merchant,
      category: data.branch?.category,
    },
  };
};
