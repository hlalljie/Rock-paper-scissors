import { useState } from 'react'
import ChatComponent from './ChatComponent.jsx';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <h1>Your Application</h1>
      <ChatComponent />
    </div>
    </>
  )
}

export default App
