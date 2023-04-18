import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Select from 'react-select'
import './App.css'

import { MantineProvider, Button, Skeleton, Textarea, Title} from '@mantine/core';

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
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{colorScheme: 'light'}}>
      <Title
        order={1}

      >
        PoetryMood
      </Title>
      <div className="panels">
        <div id="enter-poem-area">
          <h3>Poem:</h3>
          <Textarea
            placeholder='Start your poem here...'
            autosize
            minRows={4}
            maxRows={10}
          >

          </Textarea>
          <p>-----</p>
          <div style={{"display" : "flex", "flexDirection" : "row"}}>
            <div style={{"margin" : "10px"}}>
              <Button color="indigo" variant="outline" onClick={uploadClicked}>
                Upload PDF/DOCX
              </Button>
            </div>
            <p>OR</p>
            <div style={{"margin" : "10px"}}>
            <Button variant="outline" onClick={generateClicked}>
              Generate poem
            </Button>
            </div>
          </div>
        </div>
        <Button
          variant='gradient'
          gradient={{from: 'indigo', to : 'cyan'}}
          size='xl'
          onClick={classifyClicked}
          >
          Classify!
        </Button>
        <div style={{"marginTop" : "50px", "marginLeft" : "30px"}}>
          <Skeleton height={500} width={600}>
          
          </Skeleton>
        </div>
      </div>
    </MantineProvider>
  );

  function classifyClicked()
  {
    console.log("classify button clicked");
  }

  function uploadClicked()
  {
    console.log("upload button clicked");
  }

  function generateClicked()
  {
    console.log("generate button clicked");
  }

  // return (
  //   <div className="App">
  //     <h1>PoetryMood</h1>
  //     <div className="content">
  //       <button onClick={() => setTab("user")}>Show tab 1</button>
  //       <button onClick={() => setTab("generate")}>Show tab 2</button>

  //       { tab == "user" && (
  //           <div>
  //             <div className='user-text'>
  //               <textarea id="poem-textbox" name="poem" placeholder="Type your poem...">
  //               </textarea>
  //             </div>
  //             <p>OR</p>
  //             <div className = "inline">
  //               <button className='upload'>Upload PDF/DOCX</button>
  //               <button id="generate-button">Generate poem</button>
  //             </div>
  //           </div>
  //         ) 
  //       }
  //       <br/>
  //       <button type="submit">Classify</button>
  //     </div>
  //   </div>
  // );
}

export default App
