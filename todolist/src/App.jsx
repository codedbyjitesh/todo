import React, { useEffect, useState } from 'react'
import Table from './table'
import Form from './form'

export default function App() {
  const API='http://localhost:5000'
  useEffect(()=>{
    fetch(`${API}/todos`).then(res=>res.json()).then(data=>{
      setData(data)
    } )
  },[])
  const [data,setData]=useState([])


  console.log(data)
  return (
    <div>App
     <Form data={data} setData={setData}/>
        <Table data={data} setdata={setData}/>
    </div>
  )
}
