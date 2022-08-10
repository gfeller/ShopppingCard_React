import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {RootStore, StoreRootProvider, useRootStore} from "./state/root-store";
import {observer} from "mobx-react-lite";
import {ShoppingList} from "./pages/shopping-list";
import { Appbar } from './components/app-bar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {Layout} from './pages/layout';
import {User} from './pages/user';



const AppObserver = observer(() => {
  const store = useRootStore();

  return   <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ShoppingList />}/>
          <Route path='user' element={<User />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
});


function App() {
  const [store, setStore] = useState<RootStore>();

  useEffect(() => {
    const store = new RootStore();
    setStore(store);
  }, []);

  if (store) {
    return (
        <StoreRootProvider value={store}>
          <AppObserver/>
        </StoreRootProvider>
    );
  }
  return <></>
}

export default App;
