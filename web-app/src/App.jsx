import { useState, useEffect } from 'react'
import axios from "axios";
import reactLogo from './assets/react.svg'
import Select from 'react-select'
import './App.css'

import { MantineProvider, Button, Skeleton, Textarea, Title, Text, Switch} from '@mantine/core';

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

  const [classification, setClassification] = useState("");
  const [poem, setPoem] = useState("");
  const [displayPoem, setDisplayPoem] = useState(false);
  const isSad  = useState(false);
  const isEvil = useState(false);
  const isHappy = useState(false);
  const isLove = useState(false);
  const isInspirational = useState(false);
  const isFamily = useState(false);
  const isNature = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if(poem != "")
    {
      //setDisplayPoem(true);
      console.log("poem value changed...");
    }
  }, [poem]);

  function classifyClicked()
  {
    console.log("classify button clicked");
    console.log(poem)
    setDisplayPoem(true)
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

  function uploadClicked()
  {
    console.log("upload button clicked");
  }

  function themeSwitched()
  {
    if(theme == "dark")
    {
      setTheme("light");
    }
    else
    {
      setTheme("dark");
    }
  }

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{colorScheme: theme }}>
      <div style={{"position" : "absolute", "right" : "50px", "display" : "inline-flex"}}>
        <div style={{"margin-right" : "10px"}}>
          <Text
            size="xs"
          >
            Dark mode:    
          </Text>
        </div>
        <Switch
          onChange={themeSwitched}
        />
      </div>
      
      <Title
        order={1}

      >
        PoetryMood
      </Title>
      <div className="panels">
        <div id="enter-poem-area">
          <h3>Poem:</h3>
          <textarea type="text" className="poem_input"
          onChange={(e) => {setPoem(e.target.value)}}>

          </textarea>
          {/* <Textarea
            placeholder='Start your poem here...'
            autosize
            minRows={4}
            maxRows={10}
            onChange={(e) => {setPoem(e.target.value)}}
          >

          </Textarea> */}
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
        { displayPoem &&  (
            <div style={{"marginTop" : "50px", "marginLeft" : "30px"}}>
              <textarea type="text" className="poem_text_display">
              {poem}
              </textarea>
              
            </div>
          )}
        </div>
    </MantineProvider>
  );

}

export default App
