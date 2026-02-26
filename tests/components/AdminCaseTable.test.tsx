import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminCaseTable from "../../src/components/AdminCaseTable";

const sample = [
  {
    id: "1",
    statement: "Case one",
    category: "general",
    answer_keywords: ["yes"],
    difficulty: 1,
    created_by: "u1",
  },
  {
    id: "2",
    statement: "Case two",
    category: "crime",
    answer_keywords: ["no"],
    difficulty: 2,
    created_by: "u2",
  },
];

test("renders table and preview button", () => {
  render(
    <AdminCaseTable
      cases={sample}
      onEdit={() => {}}
      onDelete={() => {}}
      onPreview={() => {}}
    />,
  );

  expect(screen.getByText("Case one")).toBeInTheDocument();
  expect(screen.getAllByText("Preview").length).toBe(2);
});

test("shows edit/delete for admin", () => {
  render(
    <AdminCaseTable
      cases={sample}
      onEdit={() => {}}
      onDelete={() => {}}
      isAdmin={true}
    />,
  );
  expect(screen.getAllByText("Edit").length).toBe(2);
  expect(screen.getAllByText("Delete").length).toBe(2);
});

test("shows edit only for owner", () => {
  render(
    <AdminCaseTable
      cases={sample}
      onEdit={() => {}}
      onDelete={() => {}}
      currentUserId={"u1"}
    />,
  );
  // owner u1 should see Edit/Delete on first row only
  expect(screen.getAllByText("Edit").length).toBe(1);
});
