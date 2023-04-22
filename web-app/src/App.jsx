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
  const [grad, setGrad] = useState(['gray', 'darkgray'])

  useEffect(() => {
    if(poem != "")
    {
      //setDisplayPoem(true);
      console.log("poem value changed...");
    }
  });

  function setGradient(classification_) {
    console.log(classification_)
    if (classification_ === 'evil') {
      return ['red', 'maroon']
    }
    if (classification_ === 'sad') {
      return ['blue', 'darkturquoise']
    }
    if (classification_ === 'love') {
      return ['pink', 'salmon']
    }
    if (classification_ === 'nature') {
      return ['green', 'springgreen']
    }
    if (classification_ === 'happy') {
      return ['yellow', 'darkorange']
    }
    if (classification_ === 'inspirational') {
      return ['violet', 'mediumseagreen']
    }
    if (classification_ === 'family') {
      return ['orange', 'peru']
    }

    return ['gray', 'darkgray']
  
  }

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
      let new_grad = setGradient(res.classification)
      setGrad(new_grad)
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
        <div style={{"marginRight" : "10px"}}>
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
            id="enter-poem-textarea"
            placeholder='Start your poem here...'
            size={'xl'}
            minRows={10}
            onChange={(e) => {setPoem(e.target.value); setDisplayPoem(false)}}
            value={poem}
          >

          </Textarea>
          <p>OR</p>
          <div style={{"display" : "flex", "flexDirection" : "row"}}>
            <div>
              <Button className="generate-button" variant="outline" onClick={generateClicked}>
                Generate/Complete Poem
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
          <div className="poem-classify-container">
              <Title
                order={3}
                underline={true}
                back
              >
                <Mark color={grad[0]}>Classification: {classification}</Mark>
              </Title>
            <div className="poem-classify-textarea" style={{"marginTop" : "50px", "marginLeft" : "30px"}}>
              <Text
                variant="gradient"
                gradient = {{from: grad[0], to : grad[1], deg: 45}}
              >
                {poem}
              </Text>
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
