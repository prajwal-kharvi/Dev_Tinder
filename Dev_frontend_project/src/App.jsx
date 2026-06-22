import { useState } from 'react'
import NavBar from "./components/NavBar.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
            <NavBar/>
          <h1  className="text-4xl font-bold text-blue-500">HELLO WORD</h1>

    </>
  )
}

export default App
