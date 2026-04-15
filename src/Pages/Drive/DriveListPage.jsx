import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen, RefreshCw, ExternalLink, Folder, ArrowRight } from "lucide-react";
import { getDriveFolders } from "@/Services/DriveService";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PageHeader, StatCard, DataCard, EmptyState, Toolbar, Button,
} from "@/Components/primitives";

export default function DriveListPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFolders = async () => {
    setIsRefreshing(true);
    try {
      const data = await getDriveFolders();
      setFolders(Array.isArray(data) ? data : []);
    } catch {
      setFolders([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm) return folders;
    const q = searchTerm.toLowerCase();
    return folders.filter((f) => f.name?.toLowerCase().includes(q));
  }, [folders, searchTerm]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.documents")}
        subtitle={
          t("lang") === "fr"
            ? "Dossiers clients sur Google Drive"
            : "Client folders on Google Drive"
        }
        icon={FolderOpen}
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label={t("lang") === "fr" ? "Total dossiers" : "Total folders"}
          value={folders.length}
          icon={Folder}
          tone="accent"
          loading={isLoading}
        />
        <StatCard
          label={t("lang") === "fr" ? "Dossiers actifs" : "Active folders"}
          value={folders.length}
          icon={FolderOpen}
          loading={isLoading}
        />
        <StatCard
          label={t("lang") === "fr" ? "Stockage" : "Storage"}
          value="—"
          loading={isLoading}
        />
      </div>

      <Toolbar
        search={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={
          t("lang") === "fr" ? "Rechercher un dossier..." : "Search folders..."
        }
        actions={
          <Button variant="outline" size="md" onClick={fetchFolders} disabled={isRefreshing}>
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            {t("lang") === "fr" ? "Actualiser" : "Refresh"}
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-[var(--surface-2)] rounded-[var(--radius-lg)] animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <DataCard>
          <EmptyState
            icon={Folder}
            title={t("lang") === "fr" ? "Aucun dossier" : "No folders"}
            description={
              t("lang") === "fr"
                ? "Les dossiers clients apparaitront ici."
                : "Client folders will appear here."
            }
          />
        </DataCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((folder) => (
            <button
              key={folder.id}
              onClick={() => navigate(`/drive/${folder.id}`)}
              className="text-left p-5 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] hover:border-[var(--border-2)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-px transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)]">
                  <FolderOpen size={18} />
                </div>
                <ArrowRight size={15} className="text-[var(--text-3)]" />
              </div>
              <div className="text-[15px] font-semibold text-[var(--text)] truncate">
                {folder.name}
              </div>
              <div className="text-[12px] text-[var(--text-3)] mt-1">
                {folder.createdTime
                  ? new Date(folder.createdTime).toLocaleDateString()
                  : "—"}
              </div>
              {folder.webViewLink && (
                <div
                  className="mt-3 pt-3 border-t border-[var(--border)] text-[11px] text-[var(--accent)] flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(folder.webViewLink, "_blank");
                  }}
                >
                  <ExternalLink size={11} />
                  {t("lang") === "fr" ? "Ouvrir dans Drive" : "Open in Drive"}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
