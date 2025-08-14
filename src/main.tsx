import React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App'; // 라우터 루트 컴포넌트

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
