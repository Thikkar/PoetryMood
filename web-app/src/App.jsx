import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Select from 'react-select'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [tab, setTab] = useState("user")
  // const [poem, setPoem] = useState("")
  const options = [{value: 'test', label: 'test'}, {value: 'test2', label: 'test2'}]
  return (
    <div className="App">
      <div>
        <button onClick={() => setTab("user")}>Show tab 1</button>
        <button onClick={() => setTab("generate")}>Show tab 2</button>

        { tab == "user" && (
            <div>
              <div className='user-text'>
                <label>Type poem below</label>
                <textarea id="poem" name="poem" rows="5" cols="33">
                </textarea>
              </div>
              <button className='upload'>Upload PDF/DOCX</button>
            </div>
          ) 
        }

        { tab == "generate" && (
            <div>
              Generate a <Select options={options}/> poem
              <button>Generate</button>
            </div>
          ) 
        }
        <button type="submit">Classify</button>
      </div>
    </div>
  )
}

export default App
