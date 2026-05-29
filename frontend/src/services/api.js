export const API_BASE_URL = '/api'; // Proxied via Vite

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Login gagal');
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (nama, email, password, alamat) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, email, password, alamat })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Registrasi gagal');
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDashboardSummary = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/summary`);
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    const result = await response.json();
    return result.data; // Assuming ApiResponse structure returns { status, data, message }
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
};

export const fetchChartData = async (filter = 'daily') => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/chart?filter=${filter}`);
    if (!response.ok) throw new Error('Failed to fetch chart data');
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    throw error;
  }
};

export const fetchRewards = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/rewards`);
    if (!response.ok) throw new Error('Failed to fetch rewards');
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching rewards:", error);
    throw error;
  }
};

export const createReward = async (rewardData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rewards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rewardData)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal membuat reward baru');
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const updateReward = async (id, rewardData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rewards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rewardData)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal memperbarui reward');
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const deleteReward = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rewards/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal menghapus reward');
    return result;
  } catch (error) {
    throw error;
  }
};

export const claimReward = async (rewardId, userId = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rewards/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewardId, userId })
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Gagal klaim reward');
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// Waste Categories (CRUD Admin)
export const fetchCategories = async (search = '', page = 0, size = 100) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories?search=${encodeURIComponent(search)}&page=${page}&size=${size}`);
    if (!response.ok) throw new Error('Gagal mengambil kategori sampah');
    const result = await response.json();
    return result.data; // Page object containing content
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal membuat kategori baru');
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal memperbarui kategori');
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal menghapus kategori');
    return result;
  } catch (error) {
    throw error;
  }
};

// Reward Claims
export const fetchAllClaims = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/rewards/claims`);
    if (!response.ok) throw new Error('Gagal mengambil daftar klaim reward');
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching claims:", error);
    throw error;
  }
};

export const fetchClaimsByUserId = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rewards/claims/users/${userId}`);
    if (!response.ok) throw new Error('Gagal mengambil riwayat klaim');
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching claims by user id:", error);
    throw error;
  }
};

export const confirmClaim = async (claimId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rewards/claims/${claimId}/confirm`, {
      method: 'POST'
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal mengonfirmasi klaim');
    return result.data;
  } catch (error) {
    throw error;
  }
};

// User Transactions
export const fetchTransactionsByUserId = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/users/${userId}`);
    if (!response.ok) throw new Error('Gagal mengambil riwayat transaksi setoran');
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching transactions by user:", error);
    throw error;
  }
};

export const fetchAllTransactions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    if (!response.ok) throw new Error('Gagal mengambil daftar transaksi');
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    throw error;
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transactionData)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal menyimpan transaksi setoran sampah');
    return result.data;
  } catch (error) {
    throw error;
  }
};

// Users
export const fetchUsers = async () => {
  try {
    // Adding size=1000 to fetch a large chunk of users for the dropdown
    const response = await fetch(`${API_BASE_URL}/users?size=1000`);
    if (!response.ok) throw new Error('Gagal mengambil daftar pengguna');
    const result = await response.json();
    return result.data?.content || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Waste Banks
export const fetchBanks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/waste-banks`);
    if (!response.ok) throw new Error('Gagal mengambil daftar bank sampah');
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching banks:", error);
    throw error;
  }
};
