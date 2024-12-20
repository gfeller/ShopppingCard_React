import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import {RootStore} from "./app/state/root-store";

const rootStore = new RootStore()

import './styles.scss'; // Import your SCSS file here

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <App rootStore={rootStore} />
  </StrictMode>
);
