export class OnlineService {
  subscribe(cb: (online: boolean) => void): () => void {
    cb(navigator.onLine);

    const onOnline = () => cb(true);
    const onOffline = () => cb(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }
}
