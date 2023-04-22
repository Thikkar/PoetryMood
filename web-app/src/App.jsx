import { useState, useEffect } from 'react'
import axios from "axios";
import reactLogo from './assets/react.svg'
import Select from 'react-select'
import './App.css'

import { MantineProvider, Button, Skeleton, Textarea, Title, Text} from '@mantine/core';

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

  useEffect(() => {
    if(poem != "")
    {
      setDisplayPoem(true);
      console.log("poem value changed...");
    }
  });

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

    let queryParams = (poem === "") ? "" : `?prompt=${poem}` 

    axios({
      method: "GET",
      url:`http://127.0.0.1:5000/generate${queryParams}`,
    })
    .then((response) => {
      const res = response.data
      console.log(res)
      console.log(res.poem)

      var poem_str = res.poem
      var n = 1
      console.log("Poem str is")
      console.log(poem_str)
      console.log("before")
      
      function doStuff() {
        setPoem(poem_str.slice(0,n))
        console.log(n)
        n=n+1;
        if(n<poem_str.length){
          setTimeout(doStuff, 6000/poem_str.length);
        }
      }
      setTimeout(doStuff, 6000/poem_str.length);
      console.log("after")
      
      
      

      // setPoem(res.poem)


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

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{colorScheme: 'light'}}>
      <Title
        order={1}

      >
        PoetryMood
      </Title>
      {poem}
      {classification}
      <div className="panels">
        <div id="enter-poem-area">
          <h3>Poem:</h3>
          <Textarea
            placeholder='Start your poem here...'
            autosize
            minRows={4}
            maxRows={10}
            onChange={(e) => {setPoem(e.target.value)}}
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
            <Text
              variant="gradient"
              gradient={{from : 'red', to : 'cyan', deg: 45}}
            >{poem}</Text>
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
