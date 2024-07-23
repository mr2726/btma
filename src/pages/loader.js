import '../App.css';
export function Loader({menuState}) {
    menuState(false);
    return(
        <div className='loader'>
            <h1>Loader ...</h1>
        </div>
    );
}