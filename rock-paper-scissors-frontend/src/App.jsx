import { useState } from 'react'
import ChatComponent from './ChatComponent.jsx';
import './App.css'
import Home from './Home.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <Home/>
      {/* <ChatComponent /> */}
    </div>
    </>
  )
}

export default App
