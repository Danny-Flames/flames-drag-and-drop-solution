import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { RootState } from '../../redux/store/store';
import { addSection } from '../../redux/store/slices/formBuilderSlice';
import FormSection from './FormSection';
import { Button, Empty } from 'antd';
import { FiPlus } from 'react-icons/fi';
import './FormBuilder.scss';

const FormBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const { sections, formTitle } = useSelector((state: RootState) => state.formBuilder.present);

  return (
    <div className="form-builder">
      <div className="form-builder-header">
        <div className="form-title-section">
          <h1 className="form-title">{formTitle}</h1>
          <p className="form-description">
            Drag and drop elements from the sidebar · Drag fields between sections · Ctrl+Z to undo
          </p>
        </div>
      </div>

      <div className="form-builder-content">
        {sections.length === 0 ? (
          <div className="empty-form">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="empty-description">
                  <h3>Start building your form</h3>
                  <p>Add a section to get started</p>
                </div>
              }
            >
              <Button type="primary" icon={<FiPlus />} onClick={() => dispatch(addSection())} size="large">
                Add Section
              </Button>
            </Empty>
          </div>
        ) : (
          <div className="form-sections">
            <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {sections.map((section) => (
                <FormSection key={section.id} section={section} />
              ))}
            </SortableContext>

            <div className="add-section-area">
              <Button
                type="dashed"
                icon={<FiPlus />}
                onClick={() => dispatch(addSection())}
                className="add-section-btn"
                size="large"
              >
                Add Section
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
