import React from "react";

interface CaseRow {
  id: string;
  statement: string;
  category?: string;
  answer_keywords: string[];
  difficulty: number;
  created_by?: string;
}

interface Props {
  cases: CaseRow[];
  onEdit: (row: CaseRow) => void;
  onDelete: (id: string) => void;
  onPreview?: (row: CaseRow) => void;
  currentUserId?: string;
  isAdmin?: boolean;
}

const AdminCaseTable: React.FC<Props> = ({
  cases,
  onEdit,
  onDelete,
  onPreview,
  currentUserId,
  isAdmin,
}) => {
  return (
    <div className="admin-case-table">
      <table>
        <thead>
          <tr>
            <th>Statement</th>
            <th>Category</th>
            <th>Keywords</th>
            <th>Difficulty</th>
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((row) => (
            <tr key={row.id}>
              <td>{row.statement}</td>
              <td>{row.category || "-"}</td>
              <td>{(row.answer_keywords || []).join(", ")}</td>
              <td>{row.difficulty}</td>
              <td>{row.created_by || "-"}</td>
              <td>
                <button onClick={() => onPreview?.(row)}>Preview</button>
                {(isAdmin ||
                  (row.created_by && row.created_by === currentUserId)) && (
                  <>
                    <button onClick={() => onEdit(row)}>Edit</button>
                    <button onClick={() => onDelete(row.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCaseTable;
