import React from "react";
import {
  StarIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ArrowUturnDownIcon,
} from "@heroicons/react/24/solid";
import {
  useContract,
  useContractCall,
  useContractData,
} from "@thirdweb-dev/react";
import { currency } from "../constants";
import { ethers } from "ethers";
import toast from "react-hot-toast";

function AdminControls() {
  // PULLING CONTRACT AND CONTRACT DATA ----------------
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  );

  const { data: totalCommission } = useContractData(
    contract,
    "operatorTotalCommission"
  );

  const { mutateAsync: DrawWinnerTicket } = useContractCall(
    contract,
    "DrawWinnerTicket"
  );
  const { mutateAsync: RefundAll } = useContractCall(contract, "RefundAll");
  const { mutateAsync: restartDraw } = useContractCall(contract, "restartDraw");
  const { mutateAsync: WithdrawCommission } = useContractCall(
    contract,
    "WithdrawCommission"
  );

  // HELPER FUNCTIONS START HERE -----------------------
  const drawWinner = async () => {
    const notification = toast.loading("Picking a Lucky Winner...");
    try {
      const data = await DrawWinnerTicket([{}]);
      toast.success("A Winner has been selected!", {
        id: notification,
      });
    } catch (err) {
      toast.error("Whoops something went wrong", {
        id: notification,
      });
      console.error("contract call failed", err);
    }
  };
  const onWithdrawCommission = async () => {
    const notification = toast.loading("Withdrawing commission...");
    try {
      const data = await WithdrawCommission([{}]);
      toast.success("Commission withdrawn!", {
        id: notification,
      });
    } catch (err) {
      toast.error("Whoops something went wrong", {
        id: notification,
      });
      console.error("contract call failed", err);
    }
  };
  const onRestartDraw = async () => {
    const notification = toast.loading("Restarting Lottery...");
    try {
      const data = await restartDraw([{}]);
      toast.success("Lottery restarted!", {
        id: notification,
      });
    } catch (err) {
      toast.error("Whoops something went wrong", {
        id: notification,
      });
      console.error("contract call failed", err);
    }
  };
  const onRefundAll = async () => {
    const notification = toast.loading("Refunding all...");
    try {
      const data = await RefundAll([{}]);
      toast.success("all users have been refunded", {
        id: notification,
      });
    } catch (err) {
      toast.error("Whoops something went wrong", {
        id: notification,
      });
      console.error("contract call failed", err);
    }
  };

  //   RETURN STARTS HERE ------------------------------
  return (
    <div className="text-white text-center px-5 py-3 rounded-md border-[#002a43] border ">
      <h2 className="font-bold">Admin controls</h2>
      <p className="mb-5">
        Total Comission to be withdrawn:{" "}
        {totalCommission &&
          ethers.utils.formatEther(totalCommission?.toString())}{" "}
        {currency}
      </p>
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
        <button onClick={drawWinner} className="admin-button">
          <StarIcon className="h-6 mx-auto mb-2" />
          Draw Winner
        </button>
        <button onClick={onWithdrawCommission} className="admin-button">
          <CurrencyDollarIcon className="h-6 mx-auto mb-2" />
          Withdraw Comission
        </button>
        <button onClick={onRestartDraw} className="admin-button">
          <ArrowPathIcon className="h-6 mx-auto mb-2" /> Restart Draw
        </button>
        <button onClick={onRefundAll} className="admin-button">
          <ArrowUturnDownIcon className="h-6 mx-auto mb-2" />
          Refund All
        </button>
      </div>
    </div>
  );
}

export default AdminControls;
