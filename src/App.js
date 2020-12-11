import "graphiql/graphiql.css"
import "./App.css"
import query from "./defaultQuery"

import React, { useState, useCallback, useMemo } from 'react';
// import GraphiQL from '../vendor/graphiql';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';

export default () => {

  const skedToken = useMemo(() => window.location.search ? window.location.search.substr(1) : "", [])

  const [api, setApi] = useState(skedToken ? "https://api.skedulo.com/graphql/graphql" : '')
  const [token, setToken] = useState(skedToken)

  const graphQLFetcher = useCallback((graphQLParams) => {

    return fetch(api, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
  }, [api, token])

  return (
    <div className="App">
      <div className="setting">
        <input className="form-control" placeholder="API" value={api} onChange={(evt) => setApi(evt.target.value)} />
        <input className="form-control" placeholder="Bearer Token" value={token} onChange={(evt) => setToken(evt.target.value)} />
      </div>

      <div className="main-work-space">
        <GraphiQL fetcher={graphQLFetcher} query={query} />
      </div>
    </div>
  );
}

