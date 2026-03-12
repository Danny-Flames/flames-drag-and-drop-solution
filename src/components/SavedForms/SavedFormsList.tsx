import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Tag, Input, Empty, Tooltip } from "antd";
import { IoArrowBackOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineArticle } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import {
  getSavedForms,
  deleteFormFromList,
  loadFormIntoActive,
  formatDate,
  SavedForm,
} from "../../utils/formStorage";
import { loadSnapshot } from "../../redux/store/slices/formBuilderSlice";
import ClearFormModal from "../Layout/ClearFormModal";
import PreviewModal from "../Preview/PreviewModal";
import "./SavedFormsList.scss";

interface SavedFormsListProps {
  onBack: () => void;
  onEdit: () => void;
}

const SavedFormsList: React.FC<SavedFormsListProps> = ({ onBack, onEdit }) => {
  const dispatch = useDispatch();
  const [forms, setForms] = useState<SavedForm[]>([]);
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SavedForm | null>(null);
  const [previewTarget, setPreviewTarget] = useState<SavedForm | null>(null);

  useEffect(() => {
    setForms(getSavedForms());
  }, []);

  const filtered = forms.filter((f) =>
    f.snapshot.formTitle.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteFormFromList(deleteTarget.id);
    setForms(getSavedForms());
    setDeleteTarget(null);
  };

  const handleEdit = (form: SavedForm) => {
    loadFormIntoActive(form.snapshot);
    dispatch(loadSnapshot(form.snapshot));
    onEdit();
  };

  const totalFields = (form: SavedForm) =>
    form.snapshot.sections.reduce((acc, s) => acc + s.fields.length, 0);

  return (
    <div className="saved-forms-page">
      {/* Header */}
      <div className="saved-forms-header">
        <div className="saved-forms-header-left">
          <button className="back-btn" onClick={onBack}>
            <IoArrowBackOutline size={20} />
            <span>Back to Editor</span>
          </button>
          <div className="saved-forms-title">
            <MdOutlineArticle size={22} />
            <h2>Saved Forms</h2>
            <Tag color="blue">{forms.length} total</Tag>
          </div>
        </div>

        <div className="saved-forms-search">
          <BsSearch className="search-icon" />
          <Input
            placeholder="Search forms by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            allowClear
            bordered={false}
          />
        </div>
      </div>

      {/* Content */}
      <div className="saved-forms-content">
        {filtered.length === 0 ? (
          <div className="saved-forms-empty">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                query
                  ? `No forms match "${query}"`
                  : "No saved forms yet. Build and save a form to see it here."
              }
            />
          </div>
        ) : (
          <div className="saved-forms-grid">
            {filtered.map((form) => (
              <div key={form.id} className="form-card">
                <div className="form-card-top">
                  <div className="form-card-icon">
                    <MdOutlineArticle size={28} />
                  </div>
                  <div className="form-card-meta">
                    <h3 className="form-card-title">{form.snapshot.formTitle}</h3>
                    <span className="form-card-date">
                      Saved {formatDate(form.savedAt)}
                    </span>
                  </div>
                </div>

                <div className="form-card-stats">
                  <Tag color="geekblue">
                    {form.snapshot.sections.length} section
                    {form.snapshot.sections.length !== 1 ? "s" : ""}
                  </Tag>
                  <Tag color="purple">
                    {totalFields(form)} field{totalFields(form) !== 1 ? "s" : ""}
                  </Tag>
                  {form.snapshot.formSettings.allowDraft && (
                    <Tag color="orange">Draft enabled</Tag>
                  )}
                </div>

                <p className="form-card-updated">
                  Last updated: {formatDate(form.updatedAt)}
                </p>

                <div className="form-card-actions">
                  <Tooltip title="Preview form">
                    <button
                      className="card-action-btn preview"
                      onClick={() => setPreviewTarget(form)}
                    >
                      <AiOutlineEye size={16} />
                      Preview
                    </button>
                  </Tooltip>
                  <Tooltip title="Edit form">
                    <button
                      className="card-action-btn edit"
                      onClick={() => handleEdit(form)}
                    >
                      <AiOutlineEdit size={16} />
                      Edit
                    </button>
                  </Tooltip>
                  <Tooltip title="Delete form">
                    <button
                      className="card-action-btn delete"
                      onClick={() => setDeleteTarget(form)}
                    >
                      <RiDeleteBin6Line size={16} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ClearFormModal
        open={!!deleteTarget}
        title="Delete This Form?"
        description={
          <>
            You are about to permanently delete{" "}
            <strong>"{deleteTarget?.snapshot.formTitle}"</strong>. This cannot
            be undone.
          </>
        }
        confirmText="Proceed"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Preview Modal */}
      {previewTarget && (
        <PreviewModal
          open={!!previewTarget}
          onClose={() => setPreviewTarget(null)}
          snapshotOverride={previewTarget.snapshot}
        />
      )}
    </div>
  );
};

export default SavedFormsList;