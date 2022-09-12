import React from "react";
import { PropagateLoader } from "react-spinners";

function Loading() {
  return (
    <div className="bg-[#090c1b] h-screen flex flex-col items-center justify-center text-center">
      <div className="flex items-center space-x-2 mb-10">
        <img
          className="rounded-full h-64 w-64"
          src="https://images2.imgbox.com/dd/ea/nPKyp6sP_o.png"
          alt=""
        />
        {/* <h1 className="text-lg text-white font-bold">
          LOADING THE LOTT3RY SMART CONTRACT
        </h1> */}
      </div>
      <PropagateLoader color="white" size={30} />
    </div>
  );
}

export default Loading;
