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
