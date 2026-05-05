import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { firebaseConfig } from '../firebase.config';
import { AuthService } from './auth.service';
import { ItemService } from './item.service';
import { ListService } from './list.service';
import { OnlineService } from './online.service';

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

const auth = getAuth(app);

export const authService = new AuthService(auth);
export const listService = new ListService(db, auth);
export const itemService = new ItemService(db, auth);
export const onlineService = new OnlineService();
