import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {RootStore, StoreRootProvider, useRootStore} from "./state/root-store";
import {observer} from "mobx-react-lite";
import {ShoppingList} from "./components/shopping-list";



const AppObserver = observer(() => {
  const store = useRootStore();

  return   <div className="App">
    <ShoppingList/>
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
