import React, { useState } from "react";
import { supabase } from "../supabaseClient";

interface InitialData {
  id?: string;
  statement?: string;
  category?: string;
  answer_keywords?: string[];
  difficulty?: number;
}

interface Props {
  initialData?: InitialData | null;
  onSaved: () => void;
  onCancel: () => void;
}

const CaseForm: React.FC<Props> = ({ initialData, onSaved, onCancel }) => {
  const [statement, setStatement] = useState(initialData?.statement || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [keywords, setKeywords] = useState(
    (initialData?.answer_keywords || []).join(", "),
  );
  const [difficulty, setDifficulty] = useState(initialData?.difficulty ?? 1);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const kwArray = keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from("cases")
          .update({ statement, category, answer_keywords: kwArray, difficulty })
          .eq("id", initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cases")
          .insert([
            { statement, category, answer_keywords: kwArray, difficulty },
          ]);
        if (error) throw error;
      }
      onSaved();
    } catch (err: any) {
      alert("Save failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="case-form">
      <h3>{initialData?.id ? "Edit Case" : "Create Case"}</h3>
      <form onSubmit={submit}>
        <div>
          <label>Statement</label>
          <textarea
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label>Answer Keywords (comma separated)</label>
          <input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <div>
          <label>Difficulty</label>
          <select
            value={String(difficulty)}
            onChange={(e) => setDifficulty(Number(e.target.value))}
          >
            <option value={1}>1 - Easy</option>
            <option value={2}>2 - Medium</option>
            <option value={3}>3 - Hard</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaseForm;
