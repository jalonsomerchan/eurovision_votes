import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { initializeFirestore, collection, doc, getDoc, getDocs, onSnapshot, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { controlCollection, controlDocument, votesCollection } from './config.js';

async function withTimeout(promise, ms) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error('timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timeoutId));
}

export function initCloud(firebaseConfig, { setCloudStatus, t }) {
  try {
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) return null;
    const app = initializeApp(firebaseConfig);
    const db = initializeFirestore(app, { experimentalForceLongPolling: true, useFetchStreams: false });
    setCloudStatus(t('onlineSaved', 'Guardado online'));
    return db;
  } catch (error) {
    console.error('Firebase init error:', error);
    setCloudStatus(t('localSaved', 'Guardado local'));
    return null;
  }
}

export function createCloudApi({ db, deviceId, getState, renderSongs, setCloudStatus, showFeedback, t }) {
  let realtimeReady = false;

  async function loadCloudData() {
    if (!db) return;
    try {
      const [votesSnapshot, controlSnapshot] = await Promise.all([
        getDocs(collection(db, votesCollection)),
        getDoc(doc(db, controlCollection, controlDocument)),
      ]);
      getState().setAllVoters(votesSnapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      if (controlSnapshot.exists()) getState().setControl({ ...getState().control, ...controlSnapshot.data() });
      renderSongs();
    } catch (error) {
      console.error('Cloud data load error:', error);
    }
  }

  function startRealtimeListeners() {
    if (!db || realtimeReady) return;
    realtimeReady = true;

    onSnapshot(doc(db, controlCollection, controlDocument), (snapshot) => {
      getState().setControl(snapshot.exists()
        ? { semifinals: {}, final: { positions: {} }, ...snapshot.data() }
        : { semifinals: {}, final: { positions: {} } });
      renderSongs();
    }, (error) => {
      console.error('Control realtime error:', error);
      loadCloudData();
    });

    onSnapshot(collection(db, votesCollection), (snapshot) => {
      getState().setAllVoters(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      renderSongs();
    }, (error) => {
      console.error('Votes realtime error:', error);
    });
  }

  async function saveCloudVotes() {
    const { isVotingAllowed, openNameModal, voter, votes } = getState();
    if (!db) return;
    if (!voter?.name) {
      setCloudStatus(t('missingName', 'Falta nombre'));
      openNameModal();
      return;
    }
    if (!isVotingAllowed()) return;

    try {
      setCloudStatus(t('saving', 'Guardando...'));
      await withTimeout(setDoc(doc(db, votesCollection, deviceId), {
        voterName: voter.name,
        deviceId,
        votes,
        updatedAt: serverTimestamp(),
      }, { merge: true }), 12000);
      setCloudStatus(t('onlineSaved', 'Guardado online'));
    } catch (error) {
      console.error('Firestore save error:', error);
      setCloudStatus(t('localSaved', 'Guardado local'));
      showFeedback(t('saveOnlineError', 'No se pudieron guardar los votos online. Se mantienen guardados en este dispositivo.'));
    }
  }

  return { loadCloudData, saveCloudVotes, startRealtimeListeners };
}
