import React, { useEffect, useState } from 'react';
import './app.module.scss';
import { RootStore, StoreRootProvider, useRootStore } from './state/root-store';
import { observer } from 'mobx-react-lite';
import { ShoppingList } from './pages/shopping-list';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './pages/layout';
import { User } from './pages/user';
import { SharedList } from './pages/share';
import { LinearProgress } from '@mui/material';

const AppObserver = observer(() => {
  if (!useRootStore().init) {
    return <LinearProgress />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="list" />} />
            <Route path="list" element={<ShoppingList />}>
              <Route path=":id" element={<ShoppingList />} />
            </Route>
            <Route path="share" element={<SharedList />}>
              <Route path=":id" element={<SharedList />} />
            </Route>
            <Route path="user" element={<User />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
});

function App({ rootStore }: { rootStore: RootStore }) {
  if (rootStore) {
    return (
      <StoreRootProvider value={rootStore}>
        <AppObserver />
      </StoreRootProvider>
    );
  }
  return <>MISSING ROOTSTORE</>;
}

export default App;
