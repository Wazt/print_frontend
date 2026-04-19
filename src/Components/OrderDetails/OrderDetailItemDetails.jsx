import React, { useEffect, useState } from "react";
import {
  Download, Eye, Settings, Loader, Upload, CheckCircle, XCircle, Clock,
  ChevronRight, DollarSign, Package, FileText,
} from "lucide-react";
import {
  Button, StatusPill, FormField, Input, Select,
} from "@/Components/primitives";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose,
} from "@/Components/ui/sheet";
import { toast } from "sonner";
import { updateOrderItem, nextStageOrderItem } from "@/Services/OrdersService";
import AXIOS_CONFIG from "@/config/axiosConfig";
import { useLanguage } from "@/contexts/LanguageContext";

const STATUS_OPTIONS = [
  "PENDING", "ACCEPTED", "REJECTED", "WAIT_FOR_PROCESSING", "PROCESSING",
  "PRINTED", "PAIED", "FINISHED", "DELIVERED", "CANCELLED",
];

const FILE_STATUS_MAP = {
  PENDING: { icon: Clock, tone: "warning", labelEn: "Pending", labelFr: "En attente" },
  UPLOADING: { icon: Upload, tone: "info", labelEn: "Uploading", labelFr: "Envoi..." },
  UPLOADED: { icon: CheckCircle, tone: "success", labelEn: "Uploaded", labelFr: "Envoye" },
  FAILED: { icon: XCircle, tone: "danger", labelEn: "Failed", labelFr: "Echec" },
  UNKNOWN: { icon: XCircle, tone: "neutral", labelEn: "Unknown", labelFr: "Inconnu" },
};

function FileStatusBadge({ status, isFr }) {
  const cfg = FILE_STATUS_MAP[status?.toUpperCase()] || FILE_STATUS_MAP.UNKNOWN;
  const Icon = cfg.icon;
  const toneColors = {
    warning: { bg: "var(--warning-bg)", color: "var(--warning)" },
    info: { bg: "var(--info-bg)", color: "var(--info)" },
    success: { bg: "var(--success-bg)", color: "var(--success)" },
    danger: { bg: "var(--danger-bg)", color: "var(--danger)" },
    neutral: { bg: "var(--neutral-bg)", color: "var(--text-3)" },
  }[cfg.tone];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-pill)] text-[10px] font-medium"
      style={{ background: toneColors.bg, color: toneColors.color }}
    >
      <Icon size={11} className={cfg.tone === "info" ? "animate-spin" : ""} />
      {isFr ? cfg.labelFr : cfg.labelEn}
    </span>
  );
}

function OrderDetailItemDetails({ item, onUpdateSuccess, userRole = "USER" }) {
  const { t } = useLanguage();
  const isFr = t("lang") === "fr";

  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [itemStatus, setItemStatus] = useState(item?.status);
  const [itemPrice, setItemPrice] = useState(item?.item_price || 0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [downloadLink, setDownloadLink] = useState(null);

  const isClient = userRole?.toUpperCase() === "CLIENT";
  const isAdminOrUser =
    userRole?.toUpperCase() === "ADMIN" || userRole?.toUpperCase() === "USER";

  const fileStatus = item?.file?.status || "UNKNOWN";
  const fileName = item?.file?.file_name || (isFr ? "Aucun fichier" : "No file");
  const googleFileId = item?.file?.google_file_id;
  const fileStatusUpper = fileStatus.toUpperCase();

  useEffect(() => {
    let cancelled = false;
    const fetchLink = async () => {
      if (!googleFileId) return;
      try {
        const response = await AXIOS_CONFIG.post(`/drive/${googleFileId}/download/`);
        if (!cancelled) setDownloadLink(response.data);
      } catch (err) {
        console.error("Failed to get download link:", err);
      }
    };
    fetchLink();
    return () => {
      cancelled = true;
    };
  }, [googleFileId]);

  const handleDownload = () => {
    if (!downloadLink) {
      toast.error(isFr ? "Lien indisponible" : "Download link unavailable");
      return;
    }
    setIsDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = downloadLink;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(isFr ? "Telechargement lance" : "Download started");
    } catch (err) {
      console.error(err);
      toast.error(isFr ? "Echec du telechargement" : "Download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreview = () => {
    if (!googleFileId) {
      toast.error(isFr ? "Aucun fichier" : "No file available");
      return;
    }
    window.open(`https://drive.google.com/file/d/${googleFileId}/view`, "_blank");
  };

  const handleUpdateItem = async () => {
    if (!itemStatus) return toast.warning(isFr ? "Choisissez un statut" : "Select a status");
    setIsUpdating(true);
    try {
      await updateOrderItem(item.id, {
        status: itemStatus,
        item_price: parseFloat(itemPrice) || 0,
      });
      toast.success(isFr ? "Article mis a jour" : "Item updated");
      onUpdateSuccess?.();
      setSheetOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(isFr ? "Echec de la mise a jour" : "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNextStage = async () => {
    if (!item.id) return;
    setIsUpdating(true);
    try {
      const data = await nextStageOrderItem(item.id);
      toast.success(
        `${isFr ? "Statut mis a jour:" : "Status updated to"} ${data.status}`
      );
      setItemStatus(data.status);
      onUpdateSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error(isFr ? "Echec de la mise a jour" : "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--border-2)] transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* Product info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] flex-shrink-0">
            <Package size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-[14px] text-[var(--text)] truncate">
              {item.product?.name || item.item_number}
            </div>
            <div className="text-[11px] font-mono text-[var(--text-3)] mt-0.5">
              {item.item_number}
            </div>
            <div className="flex items-center gap-3 mt-2 text-[12px] text-[var(--text-3)]">
              <span>
                {isFr ? "Qte:" : "Qty:"}{" "}
                <span className="text-[var(--text)] font-semibold">{item.quantity}</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--text-4)]" />
              <span className="font-semibold text-[var(--text)] tabular-nums">
                {item.item_price?.toLocaleString() || 0} DZD
              </span>
            </div>
            <div className="mt-2">
              <StatusPill status={itemStatus} size="sm" />
            </div>
          </div>
        </div>

        {/* File */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-[var(--text-3)] flex-shrink-0" />
            <span
              className="text-[12px] text-[var(--text-2)] truncate"
              title={fileName}
            >
              {fileName}
            </span>
            <FileStatusBadge status={fileStatus} isFr={isFr} />
          </div>
          {fileStatusUpper === "UPLOADED" && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={isDownloading || !downloadLink}
                onClick={handleDownload}
              >
                {isDownloading ? (
                  <Loader size={14} className="animate-spin" />
                ) : (
                  <>
                    <Download size={14} />
                    {isFr ? "Telecharger" : "Download"}
                  </>
                )}
              </Button>
              <Button size="sm" variant="ghost" onClick={handlePreview}>
                <Eye size={14} />
                {isFr ? "Apercu" : "Preview"}
              </Button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          {isAdminOrUser && (
            <>
              <Button
                size="sm"
                variant="primary"
                onClick={handleNextStage}
                disabled={isUpdating}
                loading={isUpdating}
              >
                <span>{isFr ? "Etape suivante" : "Next stage"}</span>
                <ChevronRight size={14} />
              </Button>

              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Settings size={14} />
                    <span className="hidden sm:inline">
                      {isFr ? "Modifier" : "Customize"}
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-lg overflow-y-auto bg-[var(--surface)] border-l border-[var(--border)]">
                  <SheetHeader className="pb-4 border-b border-[var(--border)]">
                    <SheetTitle className="text-[var(--text)]">
                      {isFr ? "Modifier l'article" : "Customize item"}
                    </SheetTitle>
                    <SheetDescription className="text-[var(--text-3)]">
                      {isFr
                        ? "Modifiez le prix et le statut de cet article"
                        : "Update price and status for this order item"}
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-5 py-5">
                    {/* Product summary */}
                    <div className="rounded-[var(--radius-lg)] bg-[var(--surface-2)] border border-[var(--border)] p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                          <Package size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[14px] text-[var(--text)]">
                            {item.product?.name}
                          </h4>
                          <p className="text-[11px] font-mono text-[var(--text-3)] mt-0.5">
                            {item.item_number}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[12px] text-[var(--text-3)]">
                              {isFr ? "Qte:" : "Qty:"} {item.quantity}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-[var(--text-4)]" />
                            <span className="text-[12px] font-semibold text-[var(--text)]">
                              {item.item_price?.toLocaleString() || 0} DZD
                            </span>
                          </div>
                        </div>
                      </div>
                      {item.product?.description && (
                        <p className="text-[12px] text-[var(--text-3)] mt-3 pt-3 border-t border-[var(--border)]">
                          {item.product.description}
                        </p>
                      )}
                    </div>

                    {/* File status */}
                    <div className="rounded-[var(--radius-lg)] bg-[var(--surface-2)] border border-[var(--border)] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-[var(--text-3)]" />
                          <span className="text-[13px] font-medium text-[var(--text-2)]">
                            {isFr ? "Statut du fichier" : "File status"}
                          </span>
                        </div>
                        <FileStatusBadge status={fileStatus} isFr={isFr} />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                          {fileStatusUpper === "UPLOADED" ? (
                            <CheckCircle size={16} className="text-[var(--success)]" />
                          ) : fileStatusUpper === "UPLOADING" ? (
                            <Upload size={16} className="text-[var(--info)] animate-spin" />
                          ) : fileStatusUpper === "FAILED" ? (
                            <XCircle size={16} className="text-[var(--danger)]" />
                          ) : (
                            <Clock size={16} className="text-[var(--warning)]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[13px] font-medium text-[var(--text)] truncate"
                            title={fileName}
                          >
                            {fileName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <FormField
                      label={
                        <>
                          <DollarSign size={14} className="inline mr-1" />
                          {isFr ? "Prix de l'article (DZD)" : "Item price (DZD)"}
                        </>
                      }
                      htmlFor="item_price"
                      hint={
                        isFr
                          ? "Mettez a jour le prix de cet article"
                          : "Update the price for this specific item"
                      }
                    >
                      <Input
                        id="item_price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={itemPrice}
                        onChange={(e) => setItemPrice(e.target.value)}
                        placeholder={isFr ? "Entrez le prix" : "Enter price"}
                      />
                    </FormField>

                    {/* Status */}
                    <FormField
                      label={isFr ? "Statut de l'article" : "Item status"}
                      htmlFor="item_status"
                      hint={
                        isFr
                          ? "Ecrasez manuellement le statut du workflow"
                          : "Manually override the item workflow status"
                      }
                    >
                      <Select
                        id="item_status"
                        value={itemStatus}
                        onChange={(e) => setItemStatus(e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.replace(/_/g, " ")}
                          </option>
                        ))}
                      </Select>
                    </FormField>

                    <div
                      className="rounded-[var(--radius)] p-3 text-[12px]"
                      style={{
                        background: "var(--info-bg)",
                        color: "var(--info)",
                      }}
                    >
                      <span className="font-semibold">
                        {isFr ? "Note : " : "Note: "}
                      </span>
                      {isFr
                        ? "Les modifications sont sauvegardees immediatement et mettent a jour le total de la commande."
                        : "Changes are saved immediately and will update the order total."}
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-[var(--border)]">
                      <SheetClose asChild>
                        <Button variant="outline" className="flex-1">
                          {isFr ? "Annuler" : "Cancel"}
                        </Button>
                      </SheetClose>
                      <Button
                        variant="accent"
                        className="flex-1"
                        onClick={handleUpdateItem}
                        disabled={isUpdating}
                        loading={isUpdating}
                      >
                        <CheckCircle size={15} />
                        {isFr ? "Enregistrer" : "Save changes"}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}

          {isClient && (
            <p className="text-[11px] text-[var(--text-3)] italic">
              {isFr
                ? "Contactez le support pour toute mise a jour"
                : "Contact support for updates"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetailItemDetails;
