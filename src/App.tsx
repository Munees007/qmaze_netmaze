import React from "react";
import WordSearch from "./components/wordSeacrch";
import HomePage from "./components/HomePage";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { ThemeProvider } from "./components/ToggleContext";
import UserData from "./components/UserData";
import Thank from "./components/Thank";


const App:React.FC = ()=>{
    return(
      <ThemeProvider>
      <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/wordGame" element={<WordSearch/>}></Route>
        <Route path="/mw" element={<UserData/>}/> 
        <Route path="/end" element={<Thank/>}/>
      </Routes>
      </BrowserRouter>
      </ThemeProvider>
    )
}

export default App;