import React, { useState } from 'react';
import Chat from './Chat';
import Auth from './Auth';

function App() {
  const [token, setToken] = useState(null);

  return (
    <div className="App">
      {token ? <Chat token={token} /> : <Auth setToken={setToken} />}
    </div>
  );
}

export default App;