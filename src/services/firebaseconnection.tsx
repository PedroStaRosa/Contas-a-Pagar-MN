// Import the functions you need from the SDKs you need
/* import { getAnalytics } from "firebase/analytics"; */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
/* const analytics = getAnalytics(app); */
const db = getFirestore(app);
const auth = getAuth(app);

export { app, auth, db };

/* TESTE DE CONEXÃO */
/* const FirebaseConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  useEffect(() => {
    try {
      const auth = getAuth(app);
      if (auth) {
        setConnectionStatus("Conexão com o Firebase bem-sucedida!");
        console.log("Firebase conectado com sucesso.");
      }
    } catch (error) {
      setConnectionStatus("Falha na conexão com o Firebase.");
      console.error("Erro ao conectar no Firebase:", error);
    }
  }, []);

  return { connectionStatus };
};

export default FirebaseConnectionTest; */
