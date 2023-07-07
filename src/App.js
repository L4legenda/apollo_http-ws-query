import logo from './logo.svg';
import './App.css';
import { ApolloClient, InMemoryCache, gql, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { HttpLink } from '@apollo/client/link/http';
import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';

function App() {
  const handlerClick = () => {
    const httpLink = new HttpLink({ uri: 'https://3006-deepfoundation-dev-tcx854fo2y9.ws-eu101.gitpod.io/gql' });

    console.log("test")
    const wsClient = new SubscriptionClient(`wss://3006-deepfoundation-dev-tcx854fo2y9.ws-eu101.gitpod.io/gql`, {
      reconnect: true,
      connectionParams: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW4iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4iLCJ4LWhhc3VyYS11c2VyLWlkIjoiMzgwIn0sImlhdCI6MTY4ODcwNDE2OX0.iA2XrUFUdXLe7EWzmx8kMmKUPK5pzYQg3Clr9gcOV4I`,
      },
    });
    const wsLink = new WebSocketLink(wsClient);

    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink
    );


    const client = new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
    });

    client.query({
      query: gql`
    {
  links(limit: 1) { 
    id  
  }
}
  `,
    }).then(result => console.log(result));
  };

  return (
    <div className="App" onClick={handlerClick}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;
