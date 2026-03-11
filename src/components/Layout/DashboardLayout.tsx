import React, { useCallback, useEffect, useState } from "react";
import { Layout } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  addField,
  reorderFields,
  moveFieldToSection,
  reorderSections,
  setDraggedFieldType,
  undo,
  redo,
  clearForm,
  setFormTitle,
} from "../../redux/store/slices/formBuilderSlice";
import { RootState } from "../../redux/store/store";
import Sidebar from "../Sidebar/Sidebar";
import FormBuilder from "../FormBuilder/FormBuilder";
import PropertiesPanel from "../PropertiesPanel/PropertiesPanel";
import PreviewModal from "../Preview/PreviewModal";
import "./DashboardLayout.scss";
import { PiPencilSimpleThin } from "react-icons/pi";
import { AiOutlineEye, AiOutlineSave } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import ClearFormModal from "./ClearFormModal";

const { Header, Content } = Layout;

// A lightweight overlay card shown while dragging
const DragOverlayCard: React.FC<{ label: string; type: string }> = ({
  label,
  type,
}) => (
  <div className="drag-overlay-card">
    <span className="drag-overlay-icon">⠿</span>
    <span className="drag-overlay-label">{label}</span>
    <span className="drag-overlay-type">{type}</span>
  </div>
);

const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch();
  const { present, past, future } = useSelector(
    (state: RootState) => state.formBuilder
  );
  const { sections, formTitle } = present;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragData, setActiveDragData] = useState<{
    label: string;
    type: string;
  } | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(formTitle);
  const [clearModalOpen, setClearModalOpen] = useState(false);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  // Keyboard shortcuts: Ctrl+Z undo, Ctrl+Y / Ctrl+Shift+Z redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const ctrl = isMac ? e.metaKey : e.ctrlKey;
      if (!ctrl) return;
      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        dispatch(undo());
      }
      if (e.key === "y" || (e.key === "z" && e.shiftKey)) {
        e.preventDefault();
        dispatch(redo());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Helper: find which section a field belongs to
  const findSectionOfField = useCallback(
    (fieldId: string) =>
      sections.find((s) => s.fields.some((f) => f.id === fieldId)),
    [sections]
  );

  // Helper: is this ID a section ID?
  const isSectionId = useCallback(
    (id: string) => sections.some((s) => s.id === id),
    [sections]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    if (active.data.current) {
      setActiveDragData({
        type: active.data.current.type || "field",
        label: active.data.current.label || "Field",
      });
    }
    dispatch(setDraggedFieldType(active.data.current?.type || null));
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Used for cross-section visual feedback if needed
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveDragData(null);
    dispatch(setDraggedFieldType(null));

    if (!over) return;

    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;

    // ── Case 1: Dropping a NEW field from sidebar ────────────────────────────
    if (active.data.current?.isNewField) {
      const fieldType = active.data.current.type as string;
      let targetSectionId: string | null = null;

      if (isSectionId(overIdStr)) {
        targetSectionId = overIdStr;
      } else {
        // Over a field — find its section
        const section = findSectionOfField(overIdStr);
        if (section) targetSectionId = section.id;
      }

      if (!targetSectionId) return;

      dispatch(
        addField({
          sectionId: targetSectionId,
          field: {
            type: fieldType,
            label: active.data.current.label || `New ${fieldType}`,
            placeholder: `Enter ${fieldType}...`,
            required: false,
            options:
              fieldType === "radio" ||
              fieldType === "checkbox" ||
              fieldType === "select"
                ? ["Option 1", "Option 2", "Option 3"]
                : undefined,
          },
        })
      );
      return;
    }

    // ── Case 2: Reordering SECTIONS ──────────────────────────────────────────
    if (
      isSectionId(activeIdStr) &&
      isSectionId(overIdStr) &&
      activeIdStr !== overIdStr
    ) {
      const oldIndex = sections.findIndex((s) => s.id === activeIdStr);
      const newIndex = sections.findIndex((s) => s.id === overIdStr);
      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch(reorderSections({ oldIndex, newIndex }));
      }
      return;
    }

    // ── Case 3: Reordering FIELDS ────────────────────────────────────────────
    const activeSection = findSectionOfField(activeIdStr);
    if (!activeSection) return;

    const overSection = isSectionId(overIdStr)
      ? sections.find((s) => s.id === overIdStr)
      : findSectionOfField(overIdStr);

    if (!overSection) return;

    if (activeSection.id === overSection.id) {
      // Same section reorder
      const oldIndex = activeSection.fields.findIndex(
        (f) => f.id === activeIdStr
      );
      const newIndex = activeSection.fields.findIndex(
        (f) => f.id === overIdStr
      );
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        dispatch(
          reorderFields({ sectionId: activeSection.id, oldIndex, newIndex })
        );
      }
    } else {
      // Cross-section move
      const toIndex = isSectionId(overIdStr)
        ? overSection.fields.length
        : overSection.fields.findIndex((f) => f.id === overIdStr);

      dispatch(
        moveFieldToSection({
          fromSectionId: activeSection.id,
          toSectionId: overSection.id,
          fieldId: activeIdStr,
          toIndex: toIndex === -1 ? overSection.fields.length : toIndex,
        })
      );
    }
  };

  const handleTitleSave = () => {
    if (tempTitle.trim()) dispatch(setFormTitle(tempTitle.trim()));
    else setTempTitle(formTitle);
    setIsEditingTitle(false);
  };

  return (
    <Layout className="dashboard-layout">
      <Header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <span className="logo-icon">📋</span>
              <span className="logo-text">Flames</span>
            </div>
            <div className="form-title-editable">
              {isEditingTitle ? (
                <input
                  className="title-inline-input"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTitleSave();
                    if (e.key === "Escape") {
                      setTempTitle(formTitle);
                      setIsEditingTitle(false);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <div
                  className="form-title-display"
                  onClick={() => {
                    setIsEditingTitle(true);
                    setTempTitle(formTitle);
                  }}
                >
                  {formTitle}{" "}
                  <span>
                    <PiPencilSimpleThin size={18} />
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="header-actions">
            {/* Undo / Redo */}
            <button
              className={`action-btn undo-btn ${!canUndo ? "disabled" : ""}`}
              onClick={() => dispatch(undo())}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              ↩ Undo
            </button>
            <button
              className={`action-btn redo-btn ${!canRedo ? "disabled" : ""}`}
              onClick={() => dispatch(redo())}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
            >
              ↪ Redo
            </button>

            <div className="header-divider" />

            <button
              className="action-btn preview-btn"
              onClick={() => setPreviewOpen(true)}
            >
              <span>
                <AiOutlineEye size={16} />
              </span>{" "}
              Preview
            </button>
            <button
              className="action-btn save-btn"
              onClick={() => {
                // localStorage already auto-saves; just give feedback
                const btn = document.activeElement as HTMLButtonElement;
                const original = btn.textContent;
                btn.textContent = "Saved!";
                setTimeout(() => {
                  btn.textContent = original;
                }, 1500);
              }}
            >
              <span>
                <AiOutlineSave size={18} />
              </span>{" "}
              Save
            </button>
            <button
              className="action-btn clear-btn"
              onClick={() => setClearModalOpen(true)}
            >
              <RiDeleteBin6Line size={18} /> Clear
            </button>
          </div>
        </div>
      </Header>

      <Layout className="dashboard-content">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <Sidebar />
          <Content className="main-content">
            <FormBuilder />
          </Content>
          <PropertiesPanel />

          <DragOverlay>
            {activeId && activeDragData ? (
              <DragOverlayCard
                label={activeDragData.label}
                type={activeDragData.type}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </Layout>

      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} />
      <ClearFormModal
        open={clearModalOpen}
        onConfirm={() => {
          dispatch(clearForm());
          setClearModalOpen(false);
        }}
        onCancel={() => setClearModalOpen(false)}
      />
    </Layout>
  );
};

export default DashboardLayout;
