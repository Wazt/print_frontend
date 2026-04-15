import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { OrdersProvider } from "./contexts/OrdersContext";
import { Toaster } from "sonner";
import PrivateRoute from "./PrivateRoute";
import ErrorBoundary from "./Components/ErrorBoundary";

// Eagerly loaded (critical path)
import LoginPage from "./Pages/LoginPage";
import Home from "./Pages/Home";

// Lazy loaded (code-split)
const Commandes = lazy(() => import("./Pages/Commandes"));
const CreateOrderPage = lazy(() => import("./Pages/CreateOrderPage"));
const OrderDetails = lazy(() => import("./Pages/OrderDetails"));
const CompaniesPage = lazy(() => import("./Pages/CRM/CompaniesPage"));
const CreateCompany = lazy(() => import("./Pages/CRM/CreateCompany"));
const CompanyDetailPage = lazy(() => import("./Pages/CRM/CompanyDetailPage"));
const PaymentPage = lazy(() => import("./Pages/Finance/PaymentPage"));
const UsersPageList = lazy(() => import("./Pages/Users/UsersPageList"));
const CreateUserPage = lazy(() => import("./Pages/Users/CreateUserPage"));
const EditUserPage = lazy(() => import("./Pages/Users/EditUserPage"));
const UserDetailPage = lazy(() => import("./Pages/Users/UserDetailPage"));
const DriveListPage = lazy(() => import("./Pages/Drive/DriveListPage"));
const DriveFolderDetailPage = lazy(() => import("./Pages/Drive/DriveFolderDetail"));
const ProductsPage = lazy(() => import("./Pages/Products/productPage"));
const ProductDetailPage = lazy(() => import("./Pages/Products/productDetailPage"));
const ProductCreatePage = lazy(() => import("./Pages/Products/productCreatePage"));
const RawMaterialsPage = lazy(() => import("./Pages/Stock/stockPage"));
const RawMaterialDetailPage = lazy(() => import("./Pages/Stock/rawMaterialDetailPage"));
const RawMaterialCreatePage = lazy(() => import("./Pages/Stock/rawMaterialCreatePage"));
const DesignSystem = lazy(() => import("./Pages/DesignSystem"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--ob-p)] border-t-transparent" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <OrdersProvider>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/Commandes" element={<PrivateRoute><Commandes /></PrivateRoute>} />
              <Route path="/Commandes/creer" element={<PrivateRoute><CreateOrderPage /></PrivateRoute>} />
              <Route path="/Commandes/OrderDetails/:id" element={<PrivateRoute><OrderDetails /></PrivateRoute>} />
              <Route path="/companies" element={<PrivateRoute><CompaniesPage /></PrivateRoute>} />
              <Route path="/companies/create" element={<PrivateRoute><CreateCompany /></PrivateRoute>} />
              <Route path="/companies/companyDetails/:id" element={<PrivateRoute><CompanyDetailPage /></PrivateRoute>} />
              <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
              <Route path="/users" element={<PrivateRoute><UsersPageList /></PrivateRoute>} />
              <Route path="/users/create" element={<PrivateRoute><CreateUserPage /></PrivateRoute>} />
              <Route path="/users/:id" element={<PrivateRoute><UserDetailPage /></PrivateRoute>} />
              <Route path="/users/edit/:id" element={<PrivateRoute><EditUserPage /></PrivateRoute>} />
              <Route path="/drive" element={<PrivateRoute><DriveListPage /></PrivateRoute>} />
              <Route path="/drive/:folderId" element={<PrivateRoute><DriveFolderDetailPage /></PrivateRoute>} />
              <Route path="/products" element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
              <Route path="/products/:id" element={<PrivateRoute><ProductDetailPage /></PrivateRoute>} />
              <Route path="/products/new" element={<PrivateRoute><ProductCreatePage /></PrivateRoute>} />
              <Route path="/stock" element={<PrivateRoute><RawMaterialsPage /></PrivateRoute>} />
              <Route path="/stock/:id" element={<PrivateRoute><RawMaterialDetailPage /></PrivateRoute>} />
              <Route path="/stock/create" element={<PrivateRoute><RawMaterialCreatePage /></PrivateRoute>} />
            </Route>
          </Routes>
          </Suspense>
        </ErrorBoundary>
      </OrdersProvider>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
