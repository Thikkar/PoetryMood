import { useState, useEffect } from 'react'
import axios from "axios";
import reactLogo from './assets/react.svg'
import Select from 'react-select'
import './App.css'

import { MantineProvider, Button, Skeleton, Textarea, Title, Text, Switch, Mark} from '@mantine/core';

function App() {
  const [classification, setClassification] = useState("");
  const [poem, setPoem] = useState("");
  const [displayPoem, setDisplayPoem] = useState(false);
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
    setDisplayPoem(false)
    
    let queryParams = (poem === "") ? "" : `?prompt=${poem}` 

    axios({
      method: "GET",
      url:`http://127.0.0.1:5000/generate${queryParams}`,
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
          <Textarea
            placeholder='Start your poem here...'
            autosize
            minRows={4}
            maxRows={10}
            onChange={(e) => {setPoem(e.target.value); setDisplayPoem(false)}}
            value={poem}
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
        { displayPoem &&  (
            <div>
              <Title
                order={3}
                underline={true}
                back
                >
                <Mark>Classification: {classification}</Mark>
              </Title>
              <div className="poem-textarea" style={{"marginTop" : "50px", "marginLeft" : "30px"}}>
              <Text
                variant="gradient"
                gradient={{from : 'red', to : 'orange', deg: 45}}
              >{poem}</Text>
              </div>
            </div>
          )}

          { !displayPoem && (
            <div style={{"marginTop" : "50px", "marginLeft" : "30px"}}>
            <Skeleton height={500} width={600}>
            
            </Skeleton>
          </div>
          )}
      </div>
    </MantineProvider>
  );

}

export default App
