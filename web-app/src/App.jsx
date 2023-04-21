import React, { useEffect, useState } from 'react'
import axios from "axios";
import reactLogo from './assets/react.svg'
import Select from 'react-select'
import './App.css'

import { MantineProvider, Button, Skeleton, Textarea, Title} from '@mantine/core';

function App() {
  const [count, setCount] = useState(0)
  const [tab, setTab] = useState("user")
  // const [poem, setPoem] = useState("")
  const [fileUploadState, setFileUploadState] = useState("")
  const options = [
    {value: 'sad', label: 'sad'}, 
    {value: 'love', label: 'love'},
    {value: 'nature', label: 'nature'},
    {value: 'family', label: 'family'},
    {value: 'happy', label: 'happy'},
    {value: 'evil', label: 'evil'},
    {value: 'inspirational', label: 'inspirational'},
  ]

  const [classification, setClassification] = useState("")
  const [poem, setPoem] = useState("")

  function classifyClicked()
  {
    console.log("classify button clicked");

    axios({
      method: "GET",
      url:`http://127.0.0.1:5000/classify?poem=${poem}`,
    })
    .then((response) => {
      const res = response.data
      setClassification(res.classification)
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }

  function generateClicked()
  {
    console.log("generate button clicked");
    setPoem("Generating...")

    axios({
      method: "GET",
      url:`http://127.0.0.1:5000/generate`,
    })
    .then((response) => {
      const res = response.data
      console.log(res)
      setPoem(res.poem)
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{colorScheme: 'light'}}>
      <Title
        order={1}

      >
        PoetryMood
      </Title>
      {classification}
      <div className="panels">
        <div id="enter-poem-area">
          <h3>Poem:</h3>
          <Textarea
            placeholder='Start your poem here or paste a full poem...'
            autosize
            minRows={4}
            maxRows={10}
          >

          </Textarea>
          <p>OR</p>
          <div style={{"display" : "flex", "flexDirection" : "row"}}>
            <div style={{"margin" : "17px"}}>
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

}

export default App
