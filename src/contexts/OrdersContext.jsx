import { createContext, useContext, useState, useCallback } from "react";
import { getOrders, getOrderDetails } from "@/Services/OrdersService";
import { toast } from "sonner";

const OrdersContext = createContext();

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const data = await getOrders(params);
      if (Array.isArray(data)) {
        setOrders(data[0] || []);
        setPagination(data[1] || null);
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOrderById = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const data = await getOrderDetails(id);
      setCurrentOrder(data);
      return data;
    } catch (error) {
      toast.error("Failed to load order details");
      setCurrentOrder(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        pagination,
        currentOrder,
        isLoading,
        fetchOrders,
        fetchOrderById,
        clearCurrentOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
