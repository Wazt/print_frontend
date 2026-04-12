import AXIOS_CONFIG from "@/config/axiosConfig";

export const getOrders = async (params = {}) => {
  try {
    const { page = 1, status, company_id } = params;

    let queryString = `page=${page}`;
    if (status && status !== "all") {
      queryString += `&status=${status}`;
    }
    if (company_id) {
      queryString += `&company_id=${company_id}`;
    }

    const response = await AXIOS_CONFIG.get(`orders?${queryString}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
};

export const getOrderDetails = async (order_id) => {
  try {
    const response = await AXIOS_CONFIG.get(`orders/${order_id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    throw error;
  }
};

export const deleteOrder = async (order_id) => {
  try {
    const response = await AXIOS_CONFIG.delete(`orders/${order_id}/`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete order:", error);
    throw error;
  }
};

export const acceptOrder = async (order_id) => {
  try {
    const response = await AXIOS_CONFIG.patch(`orders/${order_id}/accept/`);
    return response.data;
  } catch (error) {
    console.error("Failed to accept order:", error);
    throw error;
  }
};

export const rejectOrder = async (order_id) => {
  try {
    const response = await AXIOS_CONFIG.patch(`orders/${order_id}/reject/`);
    return response.data;
  } catch (error) {
    console.error("Failed to reject order:", error);
    throw error;
  }
};

export const createOrder = async (formData) => {
  try {
    const response = await AXIOS_CONFIG.post("orders/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};

export const getOrdersStats = async () => {
  try {
    const response = await AXIOS_CONFIG.get("orders/ordersStats");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch order stats:", error);
    throw error;
  }
};

export const updateOrderItem = async (order_id, data) => {
  try {
    const response = await AXIOS_CONFIG.patch(`items/${order_id}`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update order item:", error);
    throw error;
  }
};

export const nextStageOrderItem = async (item_id) => {
  try {
    const response = await AXIOS_CONFIG.patch(`items/${item_id}/next_stage/`);
    return response.data;
  } catch (error) {
    console.error("Failed to advance order item stage:", error);
    throw error;
  }
};
