import './App.css';
import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from "./views/Home"


function App() {
  // const webcamRef = useRef(null);

  // useEffect(() => {
  //   if (webcamRef.current) {
  //     navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  //       webcamRef.current.srcObject = stream;
  //     }).catch((err) => {
  //       console.error(err);
  //     })

  //   }
  // }, [])

  return (
    // <div className="App">
    //   <div style={{ position: "relative", width: "640px", height: "480px" }}>
    //     <video ref={webcamRef} width="640" height="480" autoPlay></video>
    //     <canvas id="overlay" width="640" height="480" style={{ position: "absolute", top: 0, left: 0 }}></canvas>
    //   </div>
    // </div>
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |{" "}
      </nav>

      <Routes>
        <Route path="/" element={<Home />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
