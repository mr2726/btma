import { useState } from 'react';
import '../App.css';
import { Task } from '../components/task';

function Tasks() {
  const [myTasks, setMyTasks] = useState(JSON.parse(localStorage.getItem('tasks')));
  // TODO: Сделать завершение задачь по клику 
  const editTask = (i) => {
    var totalCoins = localStorage.getItem('coins');
    var tasks = [...myTasks];
    var additionalCoins = tasks[i].claim;
    var newCoins = +totalCoins + additionalCoins;
    localStorage.setItem('coins', newCoins);
    tasks[i].status = true;
    window.location.replace(tasks[i].link)
    setMyTasks(tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  return (
    <div className="Tasks">
        <div className='tasks__bg'>
          {
            myTasks.map((item, index) => (
              !item.status ? <Task task={item} key={index} setTasks={editTask} index={index}/> : ''
            ))
          }
        </div>
    </div>
  );
}

export default Tasks;