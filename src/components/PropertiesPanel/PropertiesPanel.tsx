import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Card, Form, Input, Switch, Select, Button, Divider, Typography } from 'antd';
import { FiSettings, FiEye, FiCode } from 'react-icons/fi';
import { RootState } from '../../redux/store/store';
import { updateField, updateFormSettings } from '../../redux/store/slices/formBuilderSlice';
import './PropertiesPanel.scss';
import { BsFillPaletteFill } from 'react-icons/bs';

const { Sider } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const PropertiesPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedField, present: { sections, formSettings } } = useSelector((state: RootState) => state.formBuilder);

  // Find the selected field and its section
  const selectedFieldData = selectedField ? (() => {
    for (const section of sections) {
      const field = section.fields.find(f => f.id === selectedField);
      if (field) {
        return { field, sectionId: section.id };
      }
    }
    return null;
  })() : null;

  const handleFieldUpdate = (updates: any) => {
    if (selectedFieldData) {
      dispatch(updateField({
        sectionId: selectedFieldData.sectionId,
        fieldId: selectedFieldData.field.id,
        updates,
      }));
    }
  };

  const handleFormSettingsUpdate = (updates: any) => {
    dispatch(updateFormSettings(updates));
  };

  if (!selectedField || !selectedFieldData) {
    return (
      <Sider width={320} className="properties-panel">
        <div className="panel-header">
          <div className="header-title">
            <FiSettings className="header-icon" />
            <span>Properties</span>
          </div>
        </div>
        
        <div className="panel-content">
          <div className="empty-state">
            <FiEye className="empty-icon" />
            <Title level={5}>No field selected</Title>
            <Text type="secondary">
              Select a form field to edit its properties
            </Text>
          </div>

          <Divider />

          <Card title="Form Settings" size="small" className="settings-card">
            <Form layout="vertical" size="small">
              <Form.Item label="Submit Button Text">
                <Input
                  value={formSettings?.submitButton}
                  onChange={(e) => handleFormSettingsUpdate({ submitButton: e.target.value })}
                  placeholder="Submit"
                />
              </Form.Item>

              <Form.Item label="Allow Save as Draft">
                <Switch
                  checked={formSettings.allowDraft}
                  onChange={(checked) => handleFormSettingsUpdate({ allowDraft: checked })}
                />
              </Form.Item>

              <Form.Item label="Theme">
                <Select
                  value={formSettings.theme}
                  onChange={(value) => handleFormSettingsUpdate({ theme: value })}
                >
                  <Option value="default">Default</Option>
                  <Option value="minimal">Minimal</Option>
                  <Option value="professional">Professional</Option>
                </Select>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Sider>
    );
  }

  const { field } = selectedFieldData;

  return (
    <Sider width={320} className="properties-panel">
      <div className="panel-header">
        <div className="header-title">
          <FiSettings className="header-icon" />
          <span>Field Properties</span>
        </div>
        <div className="field-type-badge">
          {field.type}
        </div>
      </div>
      
      <div className="panel-content">
        <Form layout="vertical" size="small">
          <Card title="Basic Settings" size="small" className="settings-card">
            <Form.Item label="Field Label">
              <Input
                value={field.label}
                onChange={(e) => handleFieldUpdate({ label: e.target.value })}
                placeholder="Enter field label"
              />
            </Form.Item>

            <Form.Item label="Placeholder Text">
              <Input
                value={field.placeholder || ''}
                onChange={(e) => handleFieldUpdate({ placeholder: e.target.value })}
                placeholder="Enter placeholder text"
              />
            </Form.Item>

            <Form.Item label="Required Field">
              <Switch
                checked={field.required}
                onChange={(checked) => handleFieldUpdate({ required: checked })}
              />
            </Form.Item>
          </Card>

          {(field.type === 'radio' || field.type === 'checkbox' || field.type === 'select') && (
            <Card title="Options" size="small" className="settings-card">
              <Form.Item label="Available Options">
                <TextArea
                  value={field.options?.join('\n') || ''}
                  onChange={(e) => {
                    const options = e.target.value.split('\n').filter(opt => opt.trim());
                    handleFieldUpdate({ options });
                  }}
                  placeholder="Enter one option per line"
                  rows={4}
                />
              </Form.Item>
            </Card>
          )}

          {(field.type === 'text' || field.type === 'textarea' || field.type === 'email') && (
            <Card title="Validation" size="small" className="settings-card">
              <Form.Item label="Minimum Length">
                <Input
                  type="number"
                  value={field.validation?.minLength || ''}
                  onChange={(e) => {
                    const minLength = parseInt(e.target.value) || undefined;
                    handleFieldUpdate({
                      validation: { ...field.validation, minLength }
                    });
                  }}
                  placeholder="Minimum characters"
                />
              </Form.Item>

              <Form.Item label="Maximum Length">
                <Input
                  type="number"
                  value={field.validation?.maxLength || ''}
                  onChange={(e) => {
                    const maxLength = parseInt(e.target.value) || undefined;
                    handleFieldUpdate({
                      validation: { ...field.validation, maxLength }
                    });
                  }}
                  placeholder="Maximum characters"
                />
              </Form.Item>
            </Card>
          )}

          <Card title="Advanced" size="small" className="settings-card">
            <Form.Item label="Field Description">
              <TextArea
                placeholder="Add help text for this field"
                rows={2}
              />
            </Form.Item>

            <Form.Item label="Default Value">
              <Input
                placeholder="Set default value"
              />
            </Form.Item>
          </Card>
        </Form>

        <Divider />

        <div className="panel-actions">
          <Button type="text" icon={<FiCode />} size="small">
            View JSON
          </Button>
          <Button type="text" icon={<BsFillPaletteFill />} size="small">
            Styling
          </Button>
        </div>
      </div>
    </Sider>
  );
};

export default PropertiesPanel;