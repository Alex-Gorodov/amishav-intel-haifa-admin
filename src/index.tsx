import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.sass';
import reportWebVitals from './reportWebVitals';
import { App } from './App';
import { store } from './store';
import { fetchUsers } from './store/api/fetchUsers.api';
import { fetchSwapRequests, fetchGiveRequests } from './store/api/fetchRequests.api';
import { DarkThemeProvider } from './context/DarkThemeContext';
import { fetchSecurityPosts } from './store/api/fetchSecurityPosts.api';
import { fetchControllCenterPosts } from './store/api/fetchControllCenterPosts.api';
import { loadGuestData } from './mocks/guestData';
import { GUEST_MODE_KEY } from './const';
import { fetchDertPosts } from './store/api/fetchDertPosts.api';
import { fetchProtocols } from './store/api/fetchProtocols.api';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

if (typeof window !== 'undefined' && localStorage.getItem(GUEST_MODE_KEY) === 'true') {
  loadGuestData(store.dispatch);
} else {
  fetchUsers(store.dispatch);
  fetchSecurityPosts(store.dispatch);
  fetchControllCenterPosts(store.dispatch);
  fetchDertPosts(store.dispatch);
  fetchSwapRequests(store.dispatch);
  fetchGiveRequests(store.dispatch);
  fetchProtocols(store.dispatch);
}

root.render(
  <React.StrictMode>
    <DarkThemeProvider>
      <App />
    </DarkThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
