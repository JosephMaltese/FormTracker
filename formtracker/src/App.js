import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./views/Home"
import SelectExercise from './views/SelectExercise';
import UploadVideo from './views/UploadVideo';
import Results from './views/Results';
import Signup from "./views/Signup";
import Login from "./views/Login";
import { AuthContextProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <BrowserRouter>
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
