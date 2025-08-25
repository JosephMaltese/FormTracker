import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./views/Home"
import SelectExercise from './views/SelectExercise';
import UploadVideo from './views/UploadVideo';
import Results from './views/Results';
import Navbar from './components/ui/navbar';
import Signup from "./views/Signup";
import Login from "./views/Login";
import { AuthContextProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

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
      <Navbar />

      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>}/>
          <Route path="/select-exercise" element={<PrivateRoute><SelectExercise/></PrivateRoute>}/>
          <Route path="/upload-video" element={<PrivateRoute><UploadVideo/></PrivateRoute>}/>
          <Route path="/results" element={<PrivateRoute><Results/></PrivateRoute>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
