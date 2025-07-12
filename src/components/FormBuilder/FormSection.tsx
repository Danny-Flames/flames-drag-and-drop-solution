import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, Input, Button, Popconfirm } from 'antd';
import { FiEdit3, FiTrash2, FiPlus, FiMove } from 'react-icons/fi';
import { FormSection as FormSectionType } from '../../redux/store/slices/formBuilderSlice';
import { updateSectionTitle, deleteSection } from '../../redux/store/slices/formBuilderSlice';
import FormField from './FormField';
import './FormSection.scss';
import { BsGripVertical } from 'react-icons/bs';

interface FormSectionProps {
  section: FormSectionType;
}

const FormSection: React.FC<FormSectionProps> = ({ section }) => {
  const dispatch = useDispatch();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(section.title);

  const { setNodeRef, isOver } = useDroppable({
    id: section.id,
  });

  const handleTitleSave = () => {
    dispatch(updateSectionTitle({ sectionId: section.id, title: tempTitle }));
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(section.title);
    setIsEditingTitle(false);
  };

  const handleDeleteSection = () => {
    dispatch(deleteSection(section.id));
  };

  return (
    <Card 
      className={`form-section ${isOver ? 'drag-over' : ''}`}
      ref={setNodeRef}
    >
      <div className="section-header">
        <div className="section-drag-handle">
          <FiMove />
        </div>
        
        <div className="section-title-area">
          {isEditingTitle ? (
            <div className="title-edit-container">
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onPressEnter={handleTitleSave}
                onBlur={handleTitleSave}
                autoFocus
                className="title-input"
              />
            </div>
          ) : (
            <div className="section-title" onClick={() => setIsEditingTitle(true)}>
              <h3>{section.title}</h3>
              <FiEdit3 className="edit-icon" />
            </div>
          )}
        </div>

        <div className="section-actions">
          <Popconfirm
            title="Delete Section"
            description="Are you sure you want to delete this section?"
            onConfirm={handleDeleteSection}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<FiTrash2 />}
              size="small"
            />
          </Popconfirm>
        </div>
      </div>

      <div className="section-content">
        {section.fields.length === 0 ? (
          <div className="empty-section">
            <div className="drop-zone">
              <FiPlus className="plus-icon" />
              <p>Drag and drop fields here</p>
            </div>
          </div>
        ) : (
          <div className="section-fields">
            <SortableContext 
              items={section.fields.map(f => f.id)} 
              strategy={verticalListSortingStrategy}
            >
              {section.fields.map((field) => (
                <FormField 
                  key={field.id} 
                  field={field} 
                  sectionId={section.id} 
                />
              ))}
            </SortableContext>
            
            <div className="field-drop-area">
              <div className="drop-zone-mini">
                <FiPlus className="plus-icon-small" />
                <span>Drop field here</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FormSection;