import React from "react";
import { Layout } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { RootState } from "../../redux/store/store";
import { addField } from "../../redux/store/slices/formBuilderSlice";
import Sidebar from "../Sidebar/Sidebar";
import FormBuilder from "../FormBuilder/FormBuilder";
import PropertiesPanel from "../PropertiesPanel/PropertiesPanel";
import "./DashboardLayout.scss";

const { Header, Content } = Layout;

const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch();

  const handleDragStart = (event: DragStartEvent) => {
    // Optional: Add visual feedback when dragging starts
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handle dropping a new field from sidebar
    if (active.data.current?.type && over.id) {
      const fieldType = active.data.current.type;
      const sectionId = over.id as string;

      const newField = {
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
      };

      dispatch(addField({ sectionId, field: newField }));
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over logic if needed
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
            <div className="form-title">
              <span>Excellence at its peak..</span>
            </div>
          </div>

          <div className="header-actions">
            <button className="action-btn preview-btn">
              <span>👁️</span>
              Preview
            </button>
            <button className="action-btn save-btn">
              <span>💾</span>
              Save
            </button>
            <button className="action-btn publish-btn">
              <span>🚀</span>
              Publish
            </button>
          </div>
        </div>
      </Header>

      <Layout className="dashboard-content">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <Sidebar />
          <Content className="main-content">
            <FormBuilder />
          </Content>
          <PropertiesPanel />
        </DndContext>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
