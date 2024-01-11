import { useState } from 'react'
import ChatComponent from './ChatComponent.jsx';
import './App.css'
import Home from './Home.jsx';
import Game from './Game.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <Game/>
      {/* <Home/> */}
      {/* <ChatComponent /> */}
    </div>
    </>
  )
}

export default App
