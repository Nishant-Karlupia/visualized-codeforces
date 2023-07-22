// @Nishant-Karlupia
// visualised-codeforces
// frontend:react, plotting:react-google-charts

import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import LoadingBar from 'react-top-loading-bar'
import Home from "./components/Home";
import Compare from "./components/Compare";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Stats from "./components/Stats";
import { useState } from "react";



function App() {
  const [progress, setProgress] = useState(0);
  
  return (
    <div>
      <Router>
      <Navbar/>
        <LoadingBar
            color='#f11946'
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
          />
        <Routes>
          <Route exact path="/" element={<Home setProgress={setProgress}/>} />
          <Route exact path="/compare" element={<Compare setProgress={setProgress}/>} />
          <Route exact path="/stats" element={<Stats setProgress={setProgress}/>} />
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
