import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/Components/ui/sheet";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/Components/ui/alert-dialog";

import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/Services/ProductsService";

import { Package, FileText, DollarSign, Trash } from "lucide-react";

function ProductDetailPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const [product, setProduct] = useState(state?.product || null);
  const [isLoading, setIsLoading] = useState(!state?.product);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchProduct = async () => {
      if (!product) {
        setIsLoading(true);
        try {
          const data = await getProductById(id);
          setProduct(data);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchProduct();
  }, [id, product]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        base_price: product.base_price ?? "",
      });
    }
  }, [product]);

  /* ================= ACTIONS ================= */

  const handleUpdate = async () => {
    try {
      const updated = await updateProduct(product.id, formData);
      setProduct(updated);
      setIsEditOpen(false);
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(product.id);
      navigate("/products");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !product) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          {product.name}
        </h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {/* Details */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-6 grid md:grid-cols-3 gap-8">
          <DetailItem
            icon={<Package />}
            label="Product Name"
            value={product.name}
          />

          <DetailItem
            icon={<FileText />}
            label="Description"
            value={product.description || "—"}
          />

          <DetailItem
            icon={<DollarSign />}
            label="Base Price"
            value={
              product.base_price !== null
                ? `$${product.base_price}`
                : "Not set"
            }
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setIsEditOpen(true)}>
          Edit
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete product?</AlertDialogTitle>
              <AlertDialogDescription>
                This action is permanent and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-white"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* EDIT DRAWER */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent side="right" className="w-[420px] p-0">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>Edit Product</SheetTitle>
          </SheetHeader>

          <div className="px-6 py-6 space-y-6 bg-muted/40">
            <Field
              label="Product Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <Field
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <Field
              label="Base Price"
              type="number"
              value={formData.base_price}
              onChange={(e) =>
                setFormData({ ...formData, base_price: e.target.value })
              }
            />
          </div>

          <SheetFooter className="px-6 py-4 border-t bg-white flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ================= UI HELPERS ================= */

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="text-gray-400 mt-1">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <Input className="bg-white" {...props} />
    </div>
  );
}

export default ProductDetailPage;
