import React from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { store } from './redux/store/store';
import DashboardLayout from './components/Layout/DashboardLayout';
import './styles/globals.scss';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#3b82f6',
            borderRadius: 8,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
          },
          components: {
            Layout: {
              bodyBg: '#f9fafb',
              headerBg: '#ffffff',
              siderBg: '#ffffff',
            },
            Card: {
              borderRadiusLG: 12,
            },
            Button: {
              borderRadius: 8,
              fontWeight: 500,
            },
            Input: {
              borderRadius: 8,
            },
            Select: {
              borderRadius: 8,
            },
          },
        }}
      >
        <DashboardLayout />
      </ConfigProvider>
    </Provider>
  );
};

export default App;