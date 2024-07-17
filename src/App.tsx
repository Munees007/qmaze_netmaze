import React from "react";
import WordSearch from "./components/wordSeacrch";
import ThemeToggle from "./components/ThemeToggle";
import HomePage from "./components/HomePage";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { ThemeProvider } from "./components/ToggleContext";

const App:React.FC = ()=>{
    return(
      <ThemeProvider>
      <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/wordGame" element={<WordSearch/>}></Route>
      </Routes>
      
        
    
      </BrowserRouter>
      </ThemeProvider>
    )
}

export default App;