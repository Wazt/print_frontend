import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetails } from "@/Services/OrdersService";
import { RefreshCw, FileText, DollarSign } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/ui/tabs";
import { toast } from "sonner";
import OrderDetailHeader from "@/Components/OrderDetails/OrderDetailHeader";
import OrderDetailSummary from "@/Components/OrderDetails/OrderDetailSummary";
import OrderDetailItems from "@/Components/OrderDetails/OrderDetailItems";
import OrderWorkflowTimeline from "@/Components/OrderDetails/OrderWorkflowTimeline";
import OrderFinancialSection from "@/Components/OrderDetails/OrderFinancialSection";
import ClientOrderDetails from "@/Pages/ClientOrderDetails";
import AuthContext from "@/contexts/AuthContext";
import { useContext } from "react";
function OrderDetails() {
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // "details" or "financial"
  const { id } = useParams();
  const {profile ,  logout } = useContext(AuthContext);

  // TODO: Get user role from your auth context
  // Example: const { user } = useAuth();
  // const userRole = user?.role || "USER";

  // TODO: Get user role from your auth context
  // Example: const { user } = useAuth();
  // const userRole = user?.role || "USER";
  const userRole = profile.role? profile.role : "USER"; // Replace with actual role from auth context

  const fetchOrderDetails = useCallback(async (showToast = false) => {
    if (showToast) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await getOrderDetails(id);
      console.log("Order details:", response);
      setOrderData(response);
      
      if (showToast) {
        toast.success("Order refreshed");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      toast.error("Failed to load order details");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  // Auto-refresh for uploading files
  useEffect(() => {
    if (!orderData?.items) return;

    const hasUploadingFiles = orderData.items.some(
      (item) => item.file?.status === "uploading" || item.file?.status === "pending"
    );

    if (!hasUploadingFiles) return;

    const intervalId = setInterval(() => {
      console.log("Auto-refreshing...");
      fetchOrderDetails(false);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [orderData, fetchOrderDetails]);

  const handleManualRefresh = () => {
    fetchOrderDetails(true);
  };

  const handleUpdateSuccess = () => {
    fetchOrderDetails(false);
  };

  if (isLoading && !orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Client role gets the client tracking view
  if (userRole === "CLIENT") {
    return <ClientOrderDetails order={orderData} />;
  }

  const hasUploadingFiles = orderData?.items?.some(
    (item) => item.file?.status === "uploading" || item.file?.status === "pending"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <OrderDetailHeader 
            order_data={orderData} 
            onStatusChange={handleUpdateSuccess}
            userRole={userRole}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 border-slate-300"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Upload Status Banner */}
        {hasUploadingFiles && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900">
                  Files uploading to Google Drive
                </p>
                <p className="text-xs text-blue-700 mt-0.5">
                  Auto-refreshing every 10 seconds
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-1">
            <TabsList className="grid w-full grid-cols-2 bg-slate-50 p-1">
              <TabsTrigger 
                value="details" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2"
              >
                <FileText size={16} />
                <span className="hidden sm:inline">Order Details</span>
                <span className="sm:hidden">Details</span>
              </TabsTrigger>
              <TabsTrigger 
                value="financial" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2"
              >
                <DollarSign size={16} />
                <span className="hidden sm:inline">Quotes & Payments</span>
                <span className="sm:hidden">Financial</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Order Details Tab */}
          <TabsContent value="details" className="space-y-6 mt-0">
            {/* Workflow Timeline */}
            <OrderWorkflowTimeline status={orderData?.status} />

            {/* Order Summary */}
            {
              userRole == "ADMIN" ?            <OrderDetailSummary orderDatas={orderData} />
:""
            }

            {/* Order Items */}
            <OrderDetailItems 
              orderDatas={orderData} 
              onUpdateSuccess={handleUpdateSuccess}
              userRole={userRole}
            />
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6 mt-0">
            <OrderFinancialSection 
              orderId={id}
              orderData={orderData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default OrderDetails;