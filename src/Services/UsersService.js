import AXIOS_CONFIG from "@/config/axiosConfig";

const getUsers = async () => {
  try {
    const response = await AXIOS_CONFIG.get("auth/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // ← better to let caller handle it
  }
};

export default getUsers;

export const createUser = (user_data) => {
  return AXIOS_CONFIG.post("auth/register_user/", user_data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      throw error;
    });
};

export const getUserDetails = async (id) => {
  try {
    const response = await AXIOS_CONFIG.get(`auth/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

// ────────────────────────────────────────────────
// NEW / IMPROVED updateUser function
// ────────────────────────────────────────────────
export const updateUser = async (userId, data) => {
  try {
    const response = await AXIOS_CONFIG.patch(`auth/users/${userId}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

export const blockUser = (id) =>
  AXIOS_CONFIG.post(`/users/blockuser/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Block failed:", err);
      throw err;
    });

export const unblockUser = (id) =>
  AXIOS_CONFIG.post(`/users/unblockUser/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Unblock failed:", err);
      throw err;
    });

export const deleteUser = (id) =>
  AXIOS_CONFIG.delete(`/users/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Delete failed:", err);
      throw err;
    });

export const AdminchangeUserPassword = (id, data) =>
  AXIOS_CONFIG.post(`/users/change-password/${id}/`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Password change failed:", err);
      throw err;
    });