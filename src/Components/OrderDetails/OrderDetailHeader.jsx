import React, { useState } from "react";
import { Download, Trash2, Check, X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deleteOrder, acceptOrder, rejectOrder } from "@/Services/OrdersService";
import { Button, DataCard, FormField, Textarea } from "@/Components/primitives";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/Components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

function OrderDetailHeader({ order_data, onStatusChange, userRole }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";

  const [orderStatus, setOrderStatus] = useState(order_data?.status);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  if (!order_data) return null;

  const status = orderStatus?.toUpperCase();
  const isPending = status === "PENDING";
  const isAccepted = status === "ACCEPTED";
  const isRejected = status === "REJECTED";
  const isAdmin = userRole === "ADMIN";

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await acceptOrder(order_data.id);
      setOrderStatus("ACCEPTED");
      toast.success(isFr ? "Commande acceptee" : "Order accepted");
      onStatusChange?.();
    } catch (error) {
      console.error(error);
      toast.error(isFr ? "Echec de l'acceptation" : "Failed to accept order");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error(isFr ? "Fournissez une raison" : "Please provide a rejection reason");
      return;
    }
    setIsRejecting(true);
    try {
      await rejectOrder(order_data.id, { reason: rejectionReason });
      setOrderStatus("REJECTED");
      setShowRejectDialog(false);
      toast.success(isFr ? "Commande rejetee" : "Order rejected");
      onStatusChange?.();
    } catch (error) {
      console.error(error);
      toast.error(isFr ? "Echec du rejet" : "Failed to reject order");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteOrder(order_data.id);
      toast.success(isFr ? "Commande supprimee" : "Order deleted");
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error(isFr ? "Echec de la suppression" : "Failed to delete order");
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const hasActions = isAdmin || isPending || isAccepted || isRejected;
  if (!hasActions) return null;

  return (
    <>
      <DataCard padded>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-[var(--text-3)] font-medium">
              {isFr ? "Actions" : "Actions"}
            </p>
            <p className="text-[14px] text-[var(--text-2)] mt-1">
              {isPending && isAdmin
                ? isFr
                  ? "Cette commande est en attente de validation."
                  : "This order is awaiting validation."
                : isAccepted
                ? isFr
                  ? "Cette commande a ete acceptee."
                  : "This order has been accepted."
                : isRejected
                ? isFr
                  ? "Cette commande a ete rejetee."
                  : "This order has been rejected."
                : isFr
                ? "Gerez cette commande."
                : "Manage this order."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isPending && isAdmin && (
              <>
                <Button
                  variant="accent"
                  size="md"
                  onClick={handleAccept}
                  loading={isAccepting}
                >
                  <Check size={15} />
                  {isFr ? "Accepter" : "Accept"}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowRejectDialog(true)}
                  className="!text-[var(--danger)] hover:!bg-[var(--danger-bg)]"
                >
                  <X size={15} />
                  {isFr ? "Rejeter" : "Reject"}
                </Button>
              </>
            )}

            <Button variant="outline" size="md">
              <Download size={15} />
              {isFr ? "Telecharger" : "Download"}
            </Button>

            {isPending && isAdmin && (
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowDeleteDialog(true)}
                className="!text-[var(--danger)] hover:!bg-[var(--danger-bg)]"
              >
                <Trash2 size={15} />
                {isFr ? "Supprimer" : "Delete"}
              </Button>
            )}
          </div>
        </div>
      </DataCard>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md bg-[var(--surface)] border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[var(--text)]">
              <AlertCircle className="text-[var(--danger)]" size={18} />
              {isFr ? "Rejeter la commande" : "Reject order"}
            </DialogTitle>
            <DialogDescription className="text-[var(--text-3)]">
              {isFr ? "Fournissez une raison pour " : "Provide a reason for rejecting "}
              <span className="font-semibold font-mono">{order_data.order_number}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <FormField
              label={isFr ? "Raison du rejet" : "Rejection reason"}
              htmlFor="rejection-reason"
              required
            >
              <Textarea
                id="rejection-reason"
                placeholder={
                  isFr
                    ? "Ex: Rupture de stock, exigences invalides..."
                    : "e.g., Out of stock, Invalid requirements..."
                }
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </FormField>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              {isFr ? "Annuler" : "Cancel"}
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={isRejecting || !rejectionReason.trim()}
              loading={isRejecting}
            >
              <X size={15} />
              {isFr ? "Rejeter la commande" : "Reject order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md bg-[var(--surface)] border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[var(--text)]">
              <AlertCircle className="text-[var(--danger)]" size={18} />
              {isFr ? "Supprimer la commande ?" : "Delete order?"}
            </DialogTitle>
            <DialogDescription className="text-[var(--text-3)]">
              {isFr ? "Cette action est irreversible. " : "This action is irreversible. "}
              <span className="font-semibold font-mono">{order_data.order_number}</span>
              {isFr ? " sera supprimee definitivement." : " will be permanently deleted."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              {isFr ? "Annuler" : "Cancel"}
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
              <Trash2 size={15} />
              {isFr ? "Supprimer" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default OrderDetailHeader;
