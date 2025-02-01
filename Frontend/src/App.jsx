import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AddImage from './AddImage/AddImage'
import ViewChemical from './ViewChemical/ViewChemical'
import LandingPage from './LandingPage/LandingPage'



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/AddImage' element={<AddImage />} />
          <Route path='/ViewChemical' element={<ViewChemical />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
