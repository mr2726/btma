import '../App.css';

export function Task({task, setTasks, index}){
    // console.log(task)
    return(
        <div className='Task'>
            <img src={require(`../img/${task.img}`)} alt='tg' />
            <p>{task.title}</p>
            <p>{task.claim}</p>
            <button onClick={() => {setTasks(index)}}>claim</button>
        </div>
    );
}