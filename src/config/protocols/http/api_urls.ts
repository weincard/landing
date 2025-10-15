export const apiUrls = {
  merchants: {
    create: "/merchants/create",
    update: "/merchants/update",
    getAll: "/merchants/all",
    getOne: "/merchants/one",
  },
  branches: {
    create: "/branches/create",
    update: "/branches/update",
    getByMerchant: "/branches/by-merchant",
    getOne: "/branches/one",
    delete: "/branches/delete",
  },
  categories: {
    create: "/categories/create",
    update: "/categories/update",
    getAll: "/categories/all",
    getOne: "/categories/one",
    delete: "/categories/delete",
  },
  auth: {
    loginByEmail: "/auth/login-by-email",
    me: "/auth/me",
  },
  users: {
    register: "/users/register",
    getAll: "/users/all",
    update: "/users/update",
    delete: "/users/delete",
    getByRole: "/users/by-role",
  },
};
