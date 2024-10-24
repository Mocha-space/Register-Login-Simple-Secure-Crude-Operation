import Login from './Components/Login.jsx'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Register from './Components/Register.jsx'
import Home from './Components/Home.jsx'

function App() {
  

  return (
    <>
<BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/Register' element={<Register/>}/>
      <Route path='/Home' element={<Home/>}/>
    </Routes>
</BrowserRouter>
    </>
  )
}

export default App
