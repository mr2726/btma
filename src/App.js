// app.js

import './App.css';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase-config';

import Menu from './components/menu';
import Home from './pages/Home';
import Friends from './pages/Friends';
import Tasks from './pages/Tasks';
import PcPage from './pages/PcPage';
import Game from './pages/Game';
import { Loader } from './pages/loader';
import useDeviceType from './components/PCHuck'; // Check PC Huck

function App() {
  const isMobile = useDeviceType();
  const [screenState, setScreenState] = useState('home'); // Screen 
  const [relativeState, setRelativeState] = useState(true); // Responsive menu 
  const [menuState, setMenuState] = useState(true); // show Menu
  const [tasks, setTasks] = useState([]); // Tasks array
  const [documentData, setDocumentData] = useState(null); // Friends Array
  
  // ID of user
  if (!localStorage.getItem('myId')){
    var getMyId = window.location.href.split('?')[1].split('=')[1]
    localStorage.setItem('myId', getMyId);
  }
  // Friends Data
  const documentId = localStorage.getItem('myId');
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

  // Score Save after finish the game
  var bestScore = +localStorage.getItem('bestScore');
  if (bestScore){
    var totalCoins = +localStorage.getItem('coins');
    localStorage.setItem('coins', +totalCoins+bestScore);
    localStorage.removeItem('bestScore');
  }
  // ! Tasks LOADING 
  useEffect(() => {
    const testTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const docsData = querySnapshot.docs.map(doc => doc.data());
      if (!localStorage.getItem('tasks')){
        localStorage.setItem('tasks', JSON.stringify(docsData)); 
      }else{
        if(JSON.parse(localStorage.getItem('tasks')).length < docsData.length){
          const newArray = [...JSON.parse(localStorage.getItem('tasks')), ...docsData];
          const uniqueArray = newArray.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.id === value.id
            ))
          );
          localStorage.setItem('tasks', JSON.stringify(uniqueArray));
        }
      }
      
    };
    testTasks();
  }, []);

  useEffect(() => {
    if (isMobile === true){
      setScreenState('pc')
    }else{
      setMenuState('home')
    }
  }, [isMobile]);

  // Switch screen function
  const switchScreen = () => {
    switch (screenState) {
      case 'home':
        return <Home setScreenState={setScreenState} />
      case 'tasks':
        return <Tasks tasksData={tasks} setTasks={setTasks} />
      case 'friends':
        return <Friends data={documentData?.referals || []} />
      case 'loader':
        return <Loader menuState={setMenuState} />
      case 'pc':
        return <PcPage menuState={setMenuState} />
      case 'game':
        return <Game menuState={setMenuState} setRelativeState={setRelativeState} setScreenState={setScreenState}/>
      default:
        return <Home />
    }
  }

  return (
    <div className="App" style={relativeState ? {position: 'relative'} : {}}>
      {switchScreen()}
      {menuState ? <Menu screenState={screenState} setScreenState={setScreenState} /> : <></>}
    </div>
  );
}

export default App;