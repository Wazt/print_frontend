// StockService.js
import AXIOS_CONFIG from "@/config/axiosConfig";

/**
 * Get all raw materials
 */
export const getRawMaterials = async () => {
  try {
    const response = await AXIOS_CONFIG.get("materials/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch raw materials:", error);
    throw error;
  }
};

/**
 * Get raw material by ID
 */
export const getRawMaterialById = async (id) => {
  try {
    const response = await AXIOS_CONFIG.get(`materials/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch raw material ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new raw material
 * @param {Object} data - { name, stock_quantity, cost_per_unit }
 */
export const createRawMaterial = async (data) => {
  try {
    const response = await AXIOS_CONFIG.post("materials/", data);
    return response.data;
  } catch (error) {
    console.error("Failed to create raw material:", error);
    throw error;
  }
};

/**
 * Update a raw material (PATCH)
 * @param {string} id - Material ID
 * @param {Object} data - Fields to update
 */
export const updateRawMaterial = async (id, data) => {
  try {
    const response = await AXIOS_CONFIG.patch(`materials/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Failed to update raw material ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a raw material
 * @param {string} id - Material ID
 */
export const deleteRawMaterial = async (id) => {
  try {
    const response = await AXIOS_CONFIG.delete(`materials/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete raw material ${id}:`, error);
    throw error;
  }
};

export default getRawMaterials;
