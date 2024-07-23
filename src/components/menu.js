import '../App.css';

function Menu({screenState, setScreenState}) {
  return (
    <div className="Menu">
      <button onClick={() => setScreenState('home')} style={screenState === 'home' ? {marginBottom: '1.5em'} : {}}><img src={require('../img/home.png')} alt='home'/></button>
      <button onClick={() => setScreenState('friends')} style={screenState === 'friends' ? {marginBottom: '1.5em'} : {}}><img src={require('../img/friends.png')} alt='friend'/></button>
      <button onClick={() => setScreenState('tasks')} style={screenState === 'tasks' ? {marginBottom: '1.5em'} : {}}><img src={require('../img/tasks.png')} alt='tasks'/></button>
    </div>
  );
}

export default Menu;

