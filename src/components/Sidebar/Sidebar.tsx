import React, { useState, useMemo } from "react";
import { Layout, Collapse, Input } from "antd";
import {
  FiType,
  FiMail,
  FiPhone,
  FiCalendar,
  FiToggleLeft,
  FiCheckSquare,
  FiList,
  FiUploadCloud,
  FiMapPin,
  FiUser,
  FiStar,
  FiImage,
  FiFileText,
  FiHash,
} from "react-icons/fi";
import { useDraggable } from "@dnd-kit/core";
import "./Sidebar.scss";
import { RiSearchLine } from "react-icons/ri";

const { Sider } = Layout;
const { Panel } = Collapse;
const { Search } = Input;

interface FieldType {
  type: string;
  label: string;
  icon: React.ReactNode;
  category: string;
}

const fieldTypes: FieldType[] = [
  { type: "text", label: "Text Input", icon: <FiType />, category: "basic" },
  {
    type: "textarea",
    label: "Text Area",
    icon: <FiFileText />,
    category: "basic",
  },
  { type: "number", label: "Number", icon: <FiHash />, category: "basic" },
  { type: "email", label: "Email", icon: <FiMail />, category: "basic" },
  { type: "phone", label: "Phone", icon: <FiPhone />, category: "basic" },
  { type: "date", label: "Date", icon: <FiCalendar />, category: "basic" },
  {
    type: "radio",
    label: "Radio Button",
    icon: <FiToggleLeft />,
    category: "choice",
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: <FiCheckSquare />,
    category: "choice",
  },
  { type: "select", label: "Dropdown", icon: <FiList />, category: "choice" },
  { type: "rating", label: "Rating", icon: <FiStar />, category: "choice" },
  {
    type: "file",
    label: "File Upload",
    icon: <FiUploadCloud />,
    category: "advanced",
  },
  {
    type: "image",
    label: "Image Upload",
    icon: <FiImage />,
    category: "advanced",
  },
  {
    type: "address",
    label: "Address",
    icon: <FiMapPin />,
    category: "advanced",
  },
  {
    type: "signature",
    label: "Signature",
    icon: <FiUser />,
    category: "advanced",
  },
];

const DraggableField: React.FC<{ field: FieldType }> = ({ field }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `sidebar-${field.type}`,
      data: { type: field.type, label: field.label, isNewField: true },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 999 : "auto",
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`field-item ${isDragging ? "dragging" : ""}`}
    >
      <div className="field-icon">{field.icon}</div>
      <span className="field-label">{field.label}</span>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return fieldTypes;
    return fieldTypes.filter(
      (f) =>
        f.label.toLowerCase().includes(q) || f.type.toLowerCase().includes(q)
    );
  }, [query]);

  const basicFields = filtered.filter((f) => f.category === "basic");
  const choiceFields = filtered.filter((f) => f.category === "choice");
  const advancedFields = filtered.filter((f) => f.category === "advanced");

  const noResults = filtered.length === 0;

  return (
    <Sider width={280} className="sidebar">
      <div className="sidebar-header">
        <h3>Form Elements</h3>
        <Search
          placeholder="Search fields..."
          className="field-search"
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          allowClear
        />
      </div>

      <div className="sidebar-content">
        {noResults ? (
          <div className="no-results">
            <span><RiSearchLine size={24} /></span>
            <p>
              No fields match "<strong>{query}</strong>"
            </p>
          </div>
        ) : (
          <Collapse
            defaultActiveKey={["basic", "choice", "advanced"]}
            ghost
            className="field-categories"
          >
            {basicFields.length > 0 && (
              <Panel
                header={`Basic Fields (${basicFields.length})`}
                key="basic"
                className="field-panel"
              >
                <div className="fields-grid">
                  {basicFields.map((field) => (
                    <DraggableField key={field.type} field={field} />
                  ))}
                </div>
              </Panel>
            )}
            {choiceFields.length > 0 && (
              <Panel
                header={`Choice Fields (${choiceFields.length})`}
                key="choice"
                className="field-panel"
              >
                <div className="fields-grid">
                  {choiceFields.map((field) => (
                    <DraggableField key={field.type} field={field} />
                  ))}
                </div>
              </Panel>
            )}
            {advancedFields.length > 0 && (
              <Panel
                header={`Advanced Fields (${advancedFields.length})`}
                key="advanced"
                className="field-panel"
              >
                <div className="fields-grid">
                  {advancedFields.map((field) => (
                    <DraggableField key={field.type} field={field} />
                  ))}
                </div>
              </Panel>
            )}
          </Collapse>
        )}
      </div>

      <div className="sidebar-footer">
        <span className="field-count">
          {fieldTypes.length} field types available
        </span>
      </div>
    </Sider>
  );
};

export default Sidebar;
