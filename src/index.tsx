import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.sass';
import reportWebVitals from './reportWebVitals';
import { App } from './App';
import { store } from './store';
import { fetchUsers } from './store/api/fetchUsers.api';
import { fetchSwapRequests, fetchGiveRequests } from './store/api/fetchRequests.api';
import { AIThemeProvider } from './context/AIThemeContext';
import { fetchSecurityPosts } from './store/api/fetchSecurityPosts.api';
import { fetchControllCenterPosts } from './store/api/fetchControllCenterPosts.api';
import { ThunkDispatch, UnknownAction, Dispatch } from '@reduxjs/toolkit';
import { DataState, AppState } from './types/State';
import { fetchDertPosts } from './store/api/fetchDertPosts.api';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

fetchUsers(store.dispatch);
fetchSecurityPosts(store.dispatch);
fetchControllCenterPosts(store.dispatch);
fetchDertPosts(store.dispatch);
fetchSwapRequests(store.dispatch);
fetchGiveRequests(store.dispatch);

root.render(
  <React.StrictMode>
    <AIThemeProvider>
      <App />
    </AIThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
