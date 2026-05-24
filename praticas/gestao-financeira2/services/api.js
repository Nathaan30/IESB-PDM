const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  listCategories: () => request("/categories"),

  createCategory: (data) =>
    request("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCategory: (id, data) =>
    request(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCategory: (id) =>
    request(`/categories/${id}`, {
      method: "DELETE",
    }),

  listTransactions: () => request("/transactions"),

  createTransaction: (data) =>
    request("/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTransaction: (id, data) =>
    request(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteTransaction: (id) =>
    request(`/transactions/${id}`, {
      method: "DELETE",
    }),
};