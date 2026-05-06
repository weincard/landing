import type {
  AllBranchesResponse,
  BranchResponse,
} from "../interfaces/branches.response.interface";

export const createBranchResponseAdapter = (data: any): BranchResponse => {
  // Handle both possible response structures: direct fields or nested in 'branch'
  const branchData = data.branch || data;

  return {
    message: data.message || "Branch created successfully",
    branch: {
      branchId: branchData.branchId,
      merchantId: branchData.merchantId,
      categoryId: branchData.categoryId,
      userId: branchData.userId,
      name: branchData.name,
      slug: branchData.slug,
      description: branchData.description,
      howItWorks: branchData.howItWorks,
      address: branchData.address,
      city: branchData.city,
      country: branchData.country,
      latitude: branchData.latitude,
      longitude: branchData.longitude,
      phone: branchData.phone,
      whatsapp: branchData.whatsapp,
      canContact: branchData.canContact,
      messageType: branchData.messageType,
      contactMessage: branchData.contactMessage,
      email: branchData.email,
      website: branchData.website,
      note: branchData.note,
      logoUrl: branchData.logoUrl,
      coverImageUrl: branchData.coverImageUrl,
      images: branchData.images || branchData.additionalImages || [],
      tags: branchData.tags || [],
      isActive: branchData.isActive,
      createdAt: branchData.createdAt
        ? new Date(branchData.createdAt)
        : undefined,
      updatedAt: branchData.updatedAt
        ? new Date(branchData.updatedAt)
        : undefined,
      merchant: branchData.merchant,
      category: branchData.category,
      branchUsers: branchData.branchUsers,
      reviews: branchData.reviews,
      favorites: branchData.favorites,
      offers: branchData.offers || [],
      redemptionsCount: branchData.redemptionsCount || 0,
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
      userId: data.branch?.userId,
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
      whatsapp: data.branch?.whatsapp,
      canContact: data.branch?.canContact,
      messageType: data.branch?.messageType,
      contactMessage: data.branch?.contactMessage,
      email: data.branch?.email,
      website: data.branch?.website,
      note: data.branch?.note,
      logoUrl: data.branch?.logoUrl,
      coverImageUrl: data.branch?.coverImageUrl,
      images: data.branch?.images || data.branch?.additionalImages || [],
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
      branchUsers: data.branch?.branchUsers,
      reviews: data.branch?.reviews,
      favorites: data.branch?.favorites,
      offers: data.branch?.offers || [],
      redemptionsCount: data.branch?.redemptionsCount || 0,
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
        userId: branch.userId,
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
        whatsapp: branch.whatsapp,
        canContact: branch.canContact,
        messageType: branch.messageType,
        contactMessage: branch.contactMessage,
        email: branch.email,
        website: branch.website,
        note: branch.note,
        logoUrl: branch.logoUrl,
        coverImageUrl: branch.coverImageUrl,
        images: branch.images || branch.additionalImages || [],
        tags: branch.tags,
        isActive: branch.isActive,
        createdAt: branch.createdAt ? new Date(branch.createdAt) : undefined,
        updatedAt: branch.updatedAt ? new Date(branch.updatedAt) : undefined,
        merchant: branch.merchant,
        category: branch.category,
        branchUsers: branch.branchUsers,
        reviews: branch.reviews,
        favorites: branch.favorites,
        offers: branch.offers || [],
        redemptionsCount: branch.redemptionsCount || 0,
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
      userId: data.branch?.userId,
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
      whatsapp: data.branch?.whatsapp,
      canContact: data.branch?.canContact,
      messageType: data.branch?.messageType,
      contactMessage: data.branch?.contactMessage,
      email: data.branch?.email,
      website: data.branch?.website,
      note: data.branch?.note,
      logoUrl: data.branch?.logoUrl,
      coverImageUrl: data.branch?.coverImageUrl,
      images: data.branch?.images || data.branch?.additionalImages || [],
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
      branchUsers: data.branch?.branchUsers,
      reviews: data.branch?.reviews,
      favorites: data.branch?.favorites,
      offers: data.branch?.offers || [],
      redemptionsCount: data.branch?.redemptionsCount || 0,
    },
  };
};
