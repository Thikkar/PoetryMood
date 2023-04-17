import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Select from 'react-select'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [tab, setTab] = useState("user")
  // const [poem, setPoem] = useState("")
  const options = [
    {value: 'sad', label: 'sad'}, 
    {value: 'love', label: 'love'},
    {value: 'nature', label: 'nature'},
    {value: 'family', label: 'family'},
    {value: 'happy', label: 'happy'},
    {value: 'evil', label: 'evil'},
    {value: 'inspirational', label: 'inspirational'},
  ]

  return (
    <div className="App">
      <h1>PoetryMood</h1>
      <div className="content">
        <button onClick={() => setTab("user")}>Show tab 1</button>
        <button onClick={() => setTab("generate")}>Show tab 2</button>

        { tab == "user" && (
            <div>
              <div className='user-text'>
                <textarea id="poem-textbox" name="poem" placeholder="Type your poem...">
                </textarea>
              </div>
              <button className='upload'>Upload PDF/DOCX</button>
            </div>
          ) 
        }

        { tab == "generate" && (
            <div className="generate-textbox">
              <p>Generate a </p>
              <Select id="generate-select" options={options}/> 
              <p>poem</p>
              <button id="generate-button">Generate</button>
            </div>
          ) 
        }
        
        <button type="submit">Classify</button>
      </div>
    </div>
  )
}

export default App
