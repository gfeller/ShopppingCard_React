import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { initializeApp, applicationDefault } from 'firebase-admin/app';

initializeApp({
  credential: applicationDefault(),
});

exports.fcmSend = onDocumentCreated('item/{itemId}', async (event) => {
  const data = event.data.data();
  const targetId = event.params.itemId;
  const containerId = data.listId;

  logger.info('fcmSend triggered', { targetId, containerId, description: data.description });

  try {
    // get the list (needed for title)
    const listDoc = await getFirestore().collection('list').doc(data.listId).get();
    const listData = listDoc.data();

    // get tokens for all owners
    const ownerUids = Object.keys(listData.owner ?? {});
    const ownerRefs = ownerUids.map(uid => getFirestore().doc('fcmTokens/' + uid));
    const ownerDocs = await getFirestore().getAll(...ownerRefs);

    const tokens = ownerDocs
      .map(doc => ({ uid: doc.id, token: doc.data()?.token }))
      .filter(entry => !!entry.token);


    await Promise.allSettled(
      tokens.map(({ token }) => {
        const message = {
          token: token,
          data: {
            type: 'item',
            targetId,
            containerId,
          },
          notification: {
            title: 'Neuer Eintrag: ' + data.description,
            body: `in der Liste ${listData.description}`,
          },
          webpush: {
            notification: {
              tag: data.listId,
              icon: '/favicon.ico',
              vibrate: [200, 100, 200],
            },
            fcmOptions: {
              link: 'https://shoppinglist-react-4eead.web.app/list/' + data.listId,
            },
          },
        };
        return getMessaging().send(message);
      })
    );
  } catch (err) {
    logger.error('fcmSend error', { error: err });
  }
});
