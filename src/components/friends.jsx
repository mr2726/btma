import { useEffect, useState } from 'react';
import '../App.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

export function MyFriends({ myData }) {
  const [documentData, setDocumentData] = useState(myData);
  const documentId = myData;
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const docRef = doc(db, 'users', documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDocumentData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
    };

    fetchDocument();
  }, [documentId]);

  if (!documentData) {
    return null;
  }

  return (
    <div key={myData.id} className="_Friends">
      <p className="_friends__name">{documentData.user_name}</p>
      <p className="_friends__coins">{documentData.coins}</p>
    </div>
  );
}
