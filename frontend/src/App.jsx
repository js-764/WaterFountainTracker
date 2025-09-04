import { useState, useEffect } from 'react' //I like to keep this import here just in case
import './css/App.css'
import {Routes, Route} from "react-router-dom"
import NavBar from './components/NavBar'
import Home from './pages/Home'
import About from './pages/About'
import HowToUse from './pages/HowToUse'


function App() {

  return (
    <>
      <NavBar />
      <Routes>
        {/* So far, I've got 3 pages :D */}
         <Route path="/" element={<Home />}/>
         <Route path="/about" element={<About />}/>
          <Route path="/how2use" element={<HowToUse />}/>
          <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </>
  )
}

export default App



  // const [array, setArray] = useState([])

  // const fetchAPI = async () => {
  //   const response = await axios.get("http://localhost:8080/api")
  //   // setArray(response.data.fruits)
  //   console.log(response.data.fruits)
  // }

  // useEffect(() => {
  //   fetchAPI()
  // }, [])


      // {/* <Routes>
      //   <Route path="/" element={<Home />}/>
      // </Routes> */}

      // {/* <p>Hey</p>
      // {array.map((fruit, index) => {
      //   <div key={index}>
      //     <p>{fruit}</p>
      //     <p>tried</p>
      //     <br/>
      //   </div>
      // })}
      // <p>Hey</p> */}
