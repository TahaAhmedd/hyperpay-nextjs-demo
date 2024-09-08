"use client"

import React, { useEffect, useState } from 'react';

import axios from 'axios';

import { useSearchParams } from 'next/navigation';

const ResultPage = () => {
  const searchParams = useSearchParams()
  const resourcePath = searchParams.get("resourcePath")

  const [state, setState] = useState({
    responseData: null,
    loading: true
  })

  useEffect(() => {
    if (!resourcePath) return
    axios.post("http://localhost:5000/api/result", { resourcePath }).then(res => {
      console.log(res.data)
      setState({
        responseData: res.data,
        loading: false
      })
    })
  }, [resourcePath])


  const checkResult = () => {
    const successPattern = /^(000\.000\.|000\.100\.1|000\.[36])/;
    const manuallPattern = /^(000\.400\.0[^3]|000\.400\.100)/;

    const match1 = successPattern.test(state.responseData.result.code);
    const match2 = manuallPattern.test(state.responseData.result.code);
    if (match1 || match2) {
      return (
        <div>
          <h1>Success</h1>
          <h3>{state.responseData.result.description}</h3>
        </div>
      )
    } else {
      return (
        <div>
          <h1>Failed</h1>
          <h3>{state.responseData.result.description}</h3>
        </div>
      )
    }
  }

  if (!state.loading) {
    return (
      <div >
        {checkResult()}
      </div>
    );
  } else {
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  }
}

export default ResultPage;