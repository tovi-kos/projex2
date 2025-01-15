import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './map.css'
import './App.css'
import FormNew from './FormNew'
import { useForm } from 'react-hook-form'
let arrUsers=[];

function addToArrUsers(u){
arrUsers.push(u);

}

function App() {
 


  return (
    <>
      <FormNew addToArrUsers={addToArrUsers}/>
    </>
  )
}

export default App
