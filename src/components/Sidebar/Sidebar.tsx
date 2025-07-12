import React from "react";
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
  // Basic Fields
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

  // Choice Fields
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

  // Advanced Fields
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

interface DraggableFieldProps {
  field: FieldType;
}

const DraggableField: React.FC<DraggableFieldProps> = ({ field }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: field.type,
      data: {
        type: field.type,
        label: field.label,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="field-item"
    >
      <div className="field-icon">{field.icon}</div>
      <span className="field-label">{field.label}</span>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const basicFields = fieldTypes.filter((field) => field.category === "basic");
  const choiceFields = fieldTypes.filter(
    (field) => field.category === "choice"
  );
  const advancedFields = fieldTypes.filter(
    (field) => field.category === "advanced"
  );

  return (
    <Sider width={280} className="sidebar">
      <div className="sidebar-header">
        <h3>Form Elements</h3>
        <Search
          placeholder="Search fields..."
          className="field-search"
          size="small"
        />
      </div>

      <div className="sidebar-content">
        <Collapse
          defaultActiveKey={["basic", "choice", "advanced"]}
          ghost
          className="field-categories"
        >
          <Panel header="Basic Fields" key="basic" className="field-panel">
            <div className="fields-grid">
              {basicFields.map((field) => (
                <DraggableField key={field.type} field={field} />
              ))}
            </div>
          </Panel>

          <Panel header="Choice Fields" key="choice" className="field-panel">
            <div className="fields-grid">
              {choiceFields.map((field) => (
                <DraggableField key={field.type} field={field} />
              ))}
            </div>
          </Panel>

          <Panel
            header="Advanced Fields"
            key="advanced"
            className="field-panel"
          >
            <div className="fields-grid">
              {advancedFields.map((field) => (
                <DraggableField key={field.type} field={field} />
              ))}
            </div>
          </Panel>
        </Collapse>
      </div>
    </Sider>
  );
};

export default Sidebar;
