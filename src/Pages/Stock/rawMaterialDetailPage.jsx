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
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
} from "@/Services/StockService";

import { Clock, DollarSign, Box, Trash } from "lucide-react";

function RawMaterialDetailPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const [material, setMaterial] = useState(state?.material || null);
  const [isLoading, setIsLoading] = useState(!state?.material);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    stock_quantity: "",
    cost_per_unit: "",
  });

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!material) {
        setIsLoading(true);
        try {
          const data = await getRawMaterialById(id);
          setMaterial(data);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchMaterial();
  }, [id, material]);

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name,
        stock_quantity: material.stock_quantity,
        cost_per_unit: material.cost_per_unit,
      });
    }
  }, [material]);

  const handleUpdate = async () => {
    try {
      const updated = await updateRawMaterial(material.id, formData);
      setMaterial(updated);
      setIsEditOpen(false);
    } catch {
      toast.error("Failed to update material");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRawMaterial(material.id);
      navigate("/stock");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !material) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          {material.name}
        </h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {/* Details */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-6 grid md:grid-cols-3 gap-8">
          <DetailItem
            icon={<Box />}
            label="Stock Quantity"
            value={material.stock_quantity}
          />
          <DetailItem
            icon={<DollarSign />}
            label="Cost per Unit"
            value={`$${material.cost_per_unit}`}
          />
          <DetailItem
            icon={<Clock />}
            label="Created At"
            value={new Date(material.created_at).toLocaleString()}
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
              <AlertDialogTitle>Delete raw material?</AlertDialogTitle>
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
            <SheetTitle>Edit Raw Material</SheetTitle>
          </SheetHeader>

          {/* Form */}
          <div className="px-6 py-6 space-y-6 bg-muted/40">
            <Field
              label="Material Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <Field
              label="Stock Quantity"
              type="number"
              value={formData.stock_quantity}
              onChange={(e) =>
                setFormData({ ...formData, stock_quantity: e.target.value })
              }
            />

            <Field
              label="Cost per Unit"
              type="number"
              value={formData.cost_per_unit}
              onChange={(e) =>
                setFormData({ ...formData, cost_per_unit: e.target.value })
              }
            />
          </div>

          {/* Footer */}
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

/* ========================== */
/* Small UI Helpers           */
/* ========================== */

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

export default RawMaterialDetailPage;
