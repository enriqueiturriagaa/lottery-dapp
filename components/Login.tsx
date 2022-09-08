import { useMetamask } from "@thirdweb-dev/react";
import React from "react";

function Login() {
  const connectWithMetamask = useMetamask();

  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center mb-10">
        <img
          className="rounded-full h-64 w-64 mb-10"
          src="https://images2.imgbox.com/dd/ea/nPKyp6sP_o.png"
          alt=""
        />
        {/* <h1 className="text-6xl text-white font-bold">LOTT3RY</h1> */}
        <h2 className="text-white">
          Get Started by logging in with your Metamask
        </h2>
        <button
          className="bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold"
          onClick={connectWithMetamask}
        >
          Login with Metamask
        </button>
      </div>
    </div>
  );
}

export default Login;
