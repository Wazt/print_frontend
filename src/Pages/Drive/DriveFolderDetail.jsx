import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, FileText, Folder, FileBadge } from "lucide-react";
import { getFolderContents } from "@/Services/DriveService";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, StatCard, DataCard, DataTable, EmptyState, Toolbar, Button,
} from "@/Components/primitives";

export default function DriveFolderDetailPage() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await getFolderContents(folderId);
        setFiles(Array.isArray(data) ? data : []);
      } catch {
        setFiles([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [folderId]);

  const filtered = useMemo(() => {
    if (!searchTerm) return files;
    const q = searchTerm.toLowerCase();
    return files.filter((f) => f.name?.toLowerCase().includes(q));
  }, [files, searchTerm]);

  const totalSize = files.reduce((sum, f) => sum + (parseInt(f.size) || 0), 0);
  const totalSizeMB = totalSize > 0 ? `${(totalSize / (1024 * 1024)).toFixed(2)} MB` : "0 MB";

  const columns = [
    {
      key: "name",
      header: t("lang") === "fr" ? "Fichier" : "File",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[var(--radius)] bg-[var(--danger-bg)] flex items-center justify-center text-[var(--danger)] flex-shrink-0">
            <FileText size={15} />
          </div>
          <div className="font-semibold text-[var(--text)] truncate">{row.name}</div>
        </div>
      ),
    },
    {
      key: "size",
      header: t("lang") === "fr" ? "Taille" : "Size",
      align: "right",
      render: (row) =>
        row.size ? (
          <span className="tabular-nums">{`${(parseInt(row.size) / (1024 * 1024)).toFixed(2)} MB`}</span>
        ) : "—",
    },
    {
      key: "createdTime",
      header: t("lang") === "fr" ? "Telecharge le" : "Uploaded",
      render: (row) =>
        row.createdTime ? new Date(row.createdTime).toLocaleDateString() : "—",
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            window.open(row.webViewLink, "_blank");
          }}
        >
          <ExternalLink size={13} />
          {t("lang") === "fr" ? "Voir" : "View"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => navigate("/drive")}>
          <ArrowLeft size={16} />
        </Button>
        <PageHeader
          title={t("lang") === "fr" ? "Fichiers du dossier" : "Folder files"}
          subtitle={
            t("lang") === "fr" ? "Documents stockes sur Google Drive" : "Documents on Google Drive"
          }
          icon={Folder}
          actions={
            <Button
              variant="accent"
              size="md"
              onClick={() => window.open(`https://drive.google.com/drive/folders/${folderId}`, "_blank")}
            >
              <ExternalLink size={14} />
              {t("lang") === "fr" ? "Ouvrir dans Drive" : "Open in Drive"}
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label={t("lang") === "fr" ? "Total fichiers" : "Total files"}
          value={files.length}
          icon={FileText}
          tone="accent"
          loading={isLoading}
        />
        <StatCard
          label={t("lang") === "fr" ? "Taille totale" : "Total size"}
          value={totalSizeMB}
          icon={FileBadge}
          loading={isLoading}
        />
        <StatCard
          label={t("lang") === "fr" ? "Type" : "Type"}
          value="PDF"
          loading={isLoading}
        />
      </div>

      <Toolbar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={t("lang") === "fr" ? "Rechercher un fichier..." : "Search files..."}
      />

      <DataCard padded={false}>
        <DataTable
          columns={columns}
          rows={filtered}
          loading={isLoading}
          empty={
            <EmptyState
              icon={FileText}
              title={t("lang") === "fr" ? "Aucun fichier" : "No files"}
              description={
                t("lang") === "fr"
                  ? "Ce dossier ne contient pas encore de documents."
                  : "This folder doesn't contain any documents yet."
              }
            />
          }
        />
      </DataCard>
    </div>
  );
}
