import {
  useContract,
  useMetamask,
  useDisconnect,
  useContractData,
  useContractCall,
  useAddress,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Login from "../components/Login";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { currency } from "../constants";
import { formatEther } from "ethers/lib/utils";
import CountdownTimer from "../components/CountdownTimer";
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee";
import AdminControls from "../components/AdminControls";

const Home: NextPage = () => {
  const address = useAddress();
  const [userTickets, setUserTickets] = useState(0);
  const [quantity, setQuantity] = useState<number>(1);

  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  );
  const { data: expiration } = useContractData(contract, "expiration");
  const { data: remainingTickets } = useContractData(
    contract,
    "RemainingTickets"
  );
  const { data: currentWinningReward } = useContractData(
    contract,
    "CurrentWinningReward"
  );
  const { data: ticketPrice } = useContractData(contract, "ticketPrice");
  const { data: ticketComission } = useContractData(
    contract,
    "ticketCommission"
  );
  const { data: tickets } = useContractData(contract, "getTickets");
  const { mutateAsync: BuyTickets } = useContractCall(contract, "BuyTickets");

  const { data: winnings } = useContractData(
    contract,
    "getWinningsForAddress",
    address
  );

  const { mutateAsync: WithdrawWinnings } = useContractCall(
    contract,
    "WithdrawWinnings"
  );

  const { data: lastWinner } = useContractData(contract, "lastWinner");
  const { data: lastWinnerAmount } = useContractData(
    contract,
    "lastWinnerAmount"
  );
  const { data: lotteryOperator } = useContractData(
    contract,
    "lotteryOperator"
  );

  useEffect(() => {
    if (!tickets) return;

    const totalTickets: string[] = tickets;
    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total),
      0
    );
    setUserTickets(noOfUserTickets);
  }, [tickets, address]);

  const handleClick = async () => {
    if (!ticketPrice) return;
    const notification = toast.loading("Buying your tickets...");

    try {
      const data = await BuyTickets([
        {
          value: ethers.utils.parseEther(
            (
              Number(ethers.utils.formatEther(ticketPrice)) * quantity
            ).toString()
          ),
        },
      ]);

      toast.success("Tickets purchased successfuly!", {
        id: notification,
      });
    } catch (err) {
      toast.error("Whooops something went wrong!", {
        id: notification,
      });
      console.error("Contract call failure", err);
    }
  };

  const onWithdrawWinnings = async () => {
    const notification = toast.loading("Withdrawing winnings...");
    try {
      const data = WithdrawWinnings([{}]);
      toast.success("Winnings withdrawn successfully!", {
        id: notification,
      });
    } catch (err) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });
      console.log("contract call failure", err);
    }
  };

  // Returns START HERE =======================================================

  if (isLoading) return <Loading />;
  if (!address) return <Login />;

  return (
    <div className="bg-[#090c1b] min-h-screen flex flex-col p-5">
      <Head>
        <title>LOTT3RY</title>
      </Head>

      <div className="flex-1">
        <Header />
        <Marquee className="bg-[#151c3f] p-5 mb-5" gradient={false} speed={100}>
          <div className=" flex space-x-2 mx-10 text-white font-bold">
            <h4>Last Winner: {lastWinner?.toString()}</h4>
            <h4>
              Previous Winnings:{" "}
              {lastWinnerAmount &&
                ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "}
              {currency}
            </h4>
          </div>
        </Marquee>
        {lotteryOperator === address && (
          <div className="flex justify-center">
            <AdminControls />
          </div>
        )}

        {winnings > 0 && (
          <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">
            <button
              onClick={onWithdrawWinnings}
              className="p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full"
            >
              <p className="font-bold">Winner winner chicken dinner!</p>
              <p>
                Total Winnings: {ethers.utils.formatEther(winnings.toString())}{" "}
                {currency}
              </p>
              <br />
              <p className="font-semibold">Click here to withdraw</p>
            </button>
          </div>
        )}
        {/* The next draw box */}
        <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5 ">
          <div className="stats-container">
            <h1 className="text-5xl text-white font-semibold text-center">
              The Next Draw
            </h1>
            <div className="flex justify-between p-2 space-x-2">
              <div className="stats">
                <h2 className="text-sm">Total Pool</h2>
                <p className="text-xl">
                  {currentWinningReward &&
                    ethers.utils.formatEther(
                      currentWinningReward.toString()
                    )}{" "}
                  {currency}
                </p>
              </div>
              <div className="stats">
                <h2 className="text-sm">Tickets Remaining</h2>
                <p className="text-xl">{remainingTickets?.toNumber()}</p>
              </div>
            </div>
            <div className="mt-5 mb-3">
              <CountdownTimer />
            </div>
          </div>

          <div className="stats-container space-y-2">
            <div className="stats-container">
              <div className="flex justify-between items-center text-white pb-2">
                <h2 className="">Price per ticket</h2>
                <p>
                  {ticketPrice &&
                    ethers.utils.formatEther(ticketPrice?.toString())}{" "}
                  {currency}
                </p>
              </div>
              <div className="flex text-white items-center space-x-2 bg-[#0a091b] border-[#5089a3] border p-4 rounded-lg">
                <p>TICKETS</p>
                <input
                  className="flex w-full bg-transparent text-right outline-none"
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2 mt-5">
                <div className="flex items-center justify-between text-[#5089a3] text-sm italic font-extrabold">
                  <p>Total cost of tickets</p>
                  <p>
                    {ticketPrice &&
                      Number(
                        ethers.utils.formatEther(ticketPrice?.toString())
                      ) * quantity}{" "}
                    {currency}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[#5089a3] text-xs italic">
                  <p>Service fees</p>
                  <p>
                    {ticketComission &&
                      ethers.utils.formatEther(
                        ticketComission?.toString()
                      )}{" "}
                    {currency}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[#5089a3] text-xs italic">
                  <p>+Network Fees</p>
                  <p>TBC</p>
                </div>
              </div>

              <button
                disabled={
                  expiration?.toString() < Date.now().toString() ||
                  remainingTickets?.toNumber() === 0
                }
                onClick={handleClick}
                className="mt-5 w-full bg-gradient-to-br font-semibold from-blue-500 to-emerald-600 px-10 py-5 rounded-md text-white shadow-xl disabled:from-gray-600  disabled:cursor-not-allowed disabled:text-gray-400"
              >
                Buy {quantity} Tickets for{" "}
                {ticketPrice &&
                  Number(ethers.utils.formatEther(ticketPrice.toString())) *
                    quantity}{" "}
                {currency}
              </button>
            </div>
            {userTickets > 0 && (
              <div className="stats">
                <p className="text-lg mb-2">
                  You have {userTickets} tickets in this draw
                </p>
                <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
                  {Array(userTickets)
                    .fill("   ")
                    .map((_, index) => (
                      <p
                        key={index}
                        className="text-emerald-300 h-20 w-12 bg-emerald-500/30  rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic"
                      >
                        {index + 1}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Price per ticket box */}
        <div></div>
      </div>
      <footer className="border-t border-emerald-500/20 flex items-center text-white justify-between p-5">
        <img
          className="h-10 w-10 filter hue-rotate-90 opacity-20 rounded-full"
          src="https://images2.imgbox.com/d4/89/P9MJFmNa_o.png"
        />
        <p className="text-xs text-[#5089a3] pl-5">
          DISCLAMER: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Nullam malesuada lacus sit amet lorem lacinia, a finibus erat
          lobortis. Fusce mollis metus nunc, iaculis malesuada urna blandit
          rhoncus. Nulla luctus eu ex et faucibus. Vestibulum vehicula velit
          vitae libero maximus posuere vitae nec sem. Ut at enim nisi.
        </p>
      </footer>
    </div>
  );
};

export default Home;
