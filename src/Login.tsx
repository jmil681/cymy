import { useState } from "react";

import { auth } from "./store/api";

enum LoginStatus {
  NotSubmitted,
  Submitted,
  AuthError,
  Success,
}

type LoginProps = {
  onSuccess: (token: string) => void;
};

function Login(props: LoginProps) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(
    LoginStatus.NotSubmitted
  );

  function authenticate() {
    setLoginStatus(LoginStatus.Submitted);

    auth(user, pass)
      .then((authResponse) => {
        setLoginStatus(LoginStatus.Success);
        props.onSuccess(authResponse.auth_token);
      })
      .catch((e) => {
        setLoginStatus(LoginStatus.AuthError);
      });
  }

  return (
    <div className="flex-grow flex items-center justify-center h-screen">
      <div className="bg-gray-200 rounded-lg shadow-lg mx-auto w-80 p-4 flex flex-col">
        <h2 className="text-2xl text-center mb-4">Login</h2>
        <form className="block flex flex-col" onSubmit={() => authenticate()}>
          <input
            type="text"
            placeholder="Username"
            value={user}
            onChange={(ev) => setUser(ev.target.value)}
            className="py-2 px-4 text-lg bg-white rounded-md ring-1 ring-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(ev) => setPass(ev.target.value)}
            className="py-2 px-4 text-lg bg-white rounded-md ring-1 ring-gray-300  mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {loginStatus === LoginStatus.AuthError ? (
            <div className="text-red-500 text-right mb-4">
              Invalid user name or password
            </div>
          ) : (
            ""
          )}
          <div className="flex justify-end">
            <button
              disabled={loginStatus === LoginStatus.Submitted}
              onClick={authenticate}
              className="px-4 py-2 rounded-md bg-green-500 text-white uppercase font-bold disabled:opacity-25"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
