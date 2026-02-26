import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import AdminCaseTable from "../components/AdminCaseTable";
import CaseForm from "../components/CaseForm";
import ErrorBanner from "../components/ErrorBanner";
import { useAuth } from "../auth/useAuth";

interface CaseRow {
  id: string;
  statement: string;
  category?: string;
  answer_keywords: string[];
  difficulty: number;
  created_by?: string;
}

const AdminPage: React.FC = () => {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<CaseRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState<CaseRow | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const { user } = useAuth();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchCases = async (pageNum = 0) => {
    setLoading(true);
    setError(null);
    try {
      const start = pageNum * pageSize;
      const end = start + pageSize - 1;
      const { data, error } = await supabase
        .from("cases")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(start, end);

      if (error) throw error;
      setCases(data || []);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // get profile and admin flag
    const loadProfile = async () => {
      if (!user) return;
      setCurrentUserId(user.id);
      const { data } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      setIsAdmin(!!(data && (data as any).is_admin));
    };

    loadProfile();
    fetchCases(page);
  }, []);

  useEffect(() => {
    fetchCases(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this case?")) return;
    try {
      const { error } = await supabase.from("cases").delete().eq("id", id);
      if (error) throw error;
      setCases((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert("Delete failed: " + (err.message || err));
    }
  };

  const handleEdit = (row: CaseRow) => {
    setEditing(row);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditing(null);
    fetchCases();
  };

  return (
    <div className="admin-page">
      <h2>Admin — Case Management</h2>

      {!isAdmin && (
        <div className="warn">
          You are not an admin. You can view cases but cannot modify others'
          cases.
        </div>
      )}

      <div className="admin-actions">
        <button onClick={handleCreate}>Create New Case</button>
        <button onClick={() => fetchCases(page)}>Refresh</button>
      </div>

      {loading && <div>Loading cases...</div>}
      {error && (
        <ErrorBanner message={error} onRetry={() => fetchCases(page)} />
      )}

      <AdminCaseTable
        cases={cases}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPreview={(row) => setPreview(row)}
        currentUserId={currentUserId || undefined}
        isAdmin={isAdmin}
      />

      <div className="pagination">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          Prev
        </button>
        <span>Page {page + 1}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      {preview && (
        <div className="preview-modal">
          <div className="preview-content">
            <h3>Preview Case</h3>
            <p>
              <strong>Statement</strong>: {preview.statement}
            </p>
            <p>
              <strong>Category</strong>: {preview.category}
            </p>
            <p>
              <strong>Keywords</strong>:{" "}
              {(preview.answer_keywords || []).join(", ")}
            </p>
            <p>
              <strong>Difficulty</strong>: {preview.difficulty}
            </p>
            <button onClick={() => setPreview(null)}>Close</button>
          </div>
        </div>
      )}

      {showForm && (
        <CaseForm
          initialData={editing}
          onSaved={handleSaved}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default AdminPage;
