import { useState } from 'react'
import SearchView from './components/SearchView/SearchView'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <SearchView></SearchView>
    </div>
  )
}

export default App
