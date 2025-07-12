import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Input, Select, Checkbox, Radio, Button, Popconfirm, Rate } from 'antd';
import { FiEdit3, FiTrash2, FiCopy, FiSettings } from 'react-icons/fi';
import { FormField as FormFieldType } from '../../redux/store/slices/formBuilderSlice';
import { updateField, deleteField, setSelectedField } from '../../redux/store/slices/formBuilderSlice';
import { RootState } from '../../redux/store/store';
import './FormField.scss';
import { BsGripVertical } from 'react-icons/bs';

const { TextArea } = Input;
const { Option } = Select;

interface FormFieldProps {
  field: FormFieldType;
  sectionId: string;
}

const FormField: React.FC<FormFieldProps> = ({ field, sectionId }) => {
  const dispatch = useDispatch();
  const selectedField = useSelector((state: RootState) => state.formBuilder.selectedField);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [tempLabel, setTempLabel] = useState(field.label);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = selectedField === field.id;

  const handleLabelSave = () => {
    dispatch(updateField({ 
      sectionId, 
      fieldId: field.id, 
      updates: { label: tempLabel } 
    }));
    setIsEditingLabel(false);
  };

  const handleLabelCancel = () => {
    setTempLabel(field.label);
    setIsEditingLabel(false);
  };

  const handleDeleteField = () => {
    dispatch(deleteField({ sectionId, fieldId: field.id }));
  };

  const handleFieldClick = () => {
    dispatch(setSelectedField(field.id));
  };

  const handleRequiredChange = (checked: boolean) => {
    dispatch(updateField({ 
      sectionId, 
      fieldId: field.id, 
      updates: { required: checked } 
    }));
  };

  const renderFieldPreview = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <Input
            placeholder={field.placeholder}
            disabled
            className="field-preview"
          />
        );
      
      case 'textarea':
        return (
          <TextArea
            placeholder={field.placeholder}
            disabled
            rows={3}
            className="field-preview"
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            disabled
            className="field-preview"
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            disabled
            className="field-preview"
          />
        );
      
      case 'select':
        return (
          <Select
            placeholder="Select an option"
            disabled
            className="field-preview"
            style={{ width: '100%' }}
          >
            {field.options?.map((option, index) => (
              <Option key={index} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        );
      
      case 'radio':
        return (
          <Radio.Group disabled className="field-preview">
            {field.options?.map((option, index) => (
              <Radio key={index} value={option} className="radio-option">
                {option}
              </Radio>
            ))}
          </Radio.Group>
        );
      
      case 'checkbox':
        return (
          <div className="field-preview checkbox-group">
            {field.options?.map((option, index) => (
              <Checkbox key={index} disabled className="checkbox-option">
                {option}
              </Checkbox>
            ))}
          </div>
        );
      
      case 'rating':
        return (
          <Rate disabled className="field-preview" />
        );
      
      case 'file':
        return (
          <div className="file-upload-preview">
            <Button disabled>Choose File</Button>
            <span className="file-text">No file chosen</span>
          </div>
        );
      
      default:
        return (
          <Input
            placeholder={field.placeholder}
            disabled
            className="field-preview"
          />
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`form-field-container ${isSelected ? 'selected' : ''}`}
      onClick={handleFieldClick}
    >
      <Card className="form-field-card" size="small">
        <div className="field-header">
          <div className="field-drag-handle" {...listeners}>
            <BsGripVertical />
          </div>
          
          <div className="field-label-area">
            {isEditingLabel ? (
              <Input
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                onPressEnter={handleLabelSave}
                onBlur={handleLabelSave}
                autoFocus
                size="small"
                className="label-input"
              />
            ) : (
              <div 
                className="field-label" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingLabel(true);
                }}
              >
                <span className="label-text">
                  {field.label}
                  {field.required && <span className="required-star">*</span>}
                </span>
                <FiEdit3 className="edit-icon" />
              </div>
            )}
          </div>

          <div className="field-actions">
            <Checkbox
              checked={field.required}
              onChange={(e) => handleRequiredChange(e.target.checked)}
              // size="small"
            >
              Required
            </Checkbox>
            
            <Button
              type="text"
              size="small"
              icon={<FiSettings />}
              onClick={(e) => {
                e.stopPropagation();
                handleFieldClick();
              }}
            />
            
            <Popconfirm
              title="Delete Field"
              description="Are you sure you want to delete this field?"
              onConfirm={handleDeleteField}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                size="small"
                icon={<FiTrash2 />}
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          </div>
        </div>

        <div className="field-content">
          {renderFieldPreview()}
        </div>
      </Card>
    </div>
  );
};

export default FormField;