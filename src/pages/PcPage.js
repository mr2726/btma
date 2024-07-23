import '../App.css';

function PcPage({menuState}) {  
  menuState(false)
  return (
    <div className="PcPage">
        <h1>Scan the QR</h1>
        <div className='gameQR'></div>
    </div>
  );
}

export default PcPage;
