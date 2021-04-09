import useLocalStorage from "./hooks/useLocalStorage";

import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const [token, setToken] = useLocalStorage<string>("auth", "");

  return (
    <div className="bg-gray-700 min-h-full">
      {token ? (
        <Dashboard token={token} onTokenExpired={() => setToken("")} />
      ) : (
        <Login onSuccess={setToken} />
      )}
    </div>
  );
}

export default App;
