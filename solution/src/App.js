import './App.css';
import {useState, useEffect, useMemo} from 'react';
import {isNameValid, getLocations} from './mock-api/apis';

function Label(props) {
  return (
    <label>{props.name}</label>
  );
}

function App() {
  const [name, setName] = useState(null);
  const [location, setLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [hideError, setHideError] = useState(true);
  const [values, setValues] = useState(new Map());
  
  useEffect(() => {
    getLocations()
    .then((data) => {
      setLocations(data);
      setLocation(data[0]);
    })
    .catch((error) => {
      console.log("Error:", error)
    })
  }, []);


  const handleAdd = () => {
    setValues(new Map(values.set(name, location)));
  }

  const handleClear = () => {
   setValues(new Map());
  }

  const returnInvalidNameIfNameDoesExist = (name) => values.has(name) ? 'invalid name' : '';

  return (
    <div className="App">
      <header className="App-header">
        <div className='Container'>
          <div className='ContainerItem' style={{textAlign: 'right'}}><Label name="Name"/></div>     
          <div className='ContainerItem'  style={{textAlign: 'left'}}><input name="Name" style={{width:'150px'}} onChange={(event) => {
            setName(event.target.value)
            isNameValid(returnInvalidNameIfNameDoesExist(event.target.value))
            .then((response) => {
              setHideError(response);
            })
            .catch((error) => {
              console.log("Error:", error)
            })
          }}></input></div>
          <div className={hideError ? "Hide" : "ContainerItem"}></div>
          <div className={hideError ? "Hide" : "ContainerItem"} style={{fontSize: '12px', textAlign: 'left', color: 'red'}}>This name has already been taken</div>
          <div className='ContainerItem' style={{textAlign: 'right'}}><Label name="Location"/> </div>
          <div className='ContainerItem'  style={{textAlign: 'left'}}> <select name="Location" style={{width:'157px'}} onChange={(event) => {
            setLocation(event.target.value)
          }}>
            {
              locations && locations.length > 0 && locations.map((value) => {
                return (
                    <option key={value}>{value}</option>
                );
              })
            }
          </select></div>
          <div className='ContainerItem'></div>
        <div className='ContainerItem' style={{textAlign: 'left'}}>
          <div className='ButtonContainer' > 
            <input type="button" value="Clear" onClick={() => handleClear()}/>
            <input type="button" value="Add" onClick={() => handleAdd()}/>
          </div>
        </div>
        </div>
        <div>
            <table style={{marginTop: '20px', fontSize: '20px'}}>
            <tbody>
            <tr style={{ backgroundColor: '#808080'}}>
              <td style={{textAlign: 'center',width:'210px' }}>S.No</td>
              <td style={{textAlign: 'center',width:'210px' }}>Name</td>
              <td style={{textAlign: 'center',width:'210px' }}>Location</td>
            </tr>
            {/* iterate keys to get values */}
            {[...values.keys()].map((entry, index) => {
                return(
                <tr key={index + 1} style={(index % 2 == 0)? {backgroundColor: '#ffffff', color : '#000000'}:{backgroundColor: '#D3D3D3', color : '#000000'}}>
                  <td style={{textAlign: 'center',width:'100px' }}>{index + 1}</td>
                  <td style={{textAlign: 'center',width:'100px' }}>{entry}</td>
                  <td style={{textAlign: 'center',width:'100px' }}>{values.get(entry)} </td> 
                  {/* above is O(1) */}
                </tr>
                )
            })}
            </tbody>
          </table>
        </div>
      </header>
    </div>
  );
}

export default App;
