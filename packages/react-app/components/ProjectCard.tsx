import React, { useState } from "react";
import { useCelo } from "@celo/react-celo";
import { StakePIR } from "@celo-composer/hardhat/types/StakePIR";
import { truncateAddress, formatTime } from "@/utils";
import { Input } from "@/components/Input";

export const ProjectCard = ({ results, contracts }) => {
  const [addressStaked, setAddressStaked] = useState<any>();
  const { kit, address } = useCelo();
  const [stakeResults, setStakeResults] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const stakingContract = contracts
    ? (new kit.connection.web3.eth.Contract(
        contracts.StakePIR.abi,
        contracts.StakePIR.address
      ) as any as StakePIR)
    : null;

  const handleChange = (e: { target: { value: any } }, name: any) => {
    setAddressStaked(e.target.value);
  };

  const fetchInfo = async () => {
    const data2 = [];
    const result = await stakingContract.methods
      .stakeInfos(addressStaked)
      .call();
    console.log(result);
    const structuredData = {
      amount: result.amount,
      claimed: result.claimed,
      endDate: result.endTS,
      startDate: result.startTS,
    };
    data2.push(structuredData);
    setStakeResults(data2);
  };

  const pausePosition = async () => {
    setLoading(true);
    await stakingContract.methods.pause().send({ from: address });
    console.log("paused");
    setLoading(false);
  };

  const unPausePosition = async () => {
    setLoading(true);
    await stakingContract.methods.unpause().send({ from: address });
    console.log("unpaused");
    setLoading(false);
  };

  return (
    <div className="flex flex-1 my-2 flex-col mt-10  p-4 white-glassmorphism  2xl:min-w-[450px] 2xl:max-w-[450px] sm:min-w-[270px] sm:max-w-[300px]  rounded-md hover:shadow-2xl">
      <div className="my-4">
        <p className="text-lg  text-white font-semibold">
          Total stakers: {results.totalStakers}
        </p>
        <p className="text-lg text-white font-semibold">
          Plan expires: {formatTime(results.planExpires)}
        </p>
        <p className="text-lg text-white font-semibold">
          Owner: {truncateAddress(results.owner)}
        </p>
        <p className="text-lg text-white font-semibold">
          Interest Rate: {results.interestRate}
        </p>
        <p className="text-lg text-white font-semibold">
          Paused: {results.paused}
        </p>
      </div>

      <div className="my-4">
        <Input
          placeholder=""
          name="stake"
          type="text"
          handleChange={handleChange}
        />

        <button
          onClick={fetchInfo}
          className="bg-gray-500 w-20 hover:bg-red-700 text-white py-1 rounded-lg text-center"
        >
          <p className="">Stake Info</p>
        </button>
      </div>

      {results &&
        stakeResults.map((result: any, index: any) => (
          <div key={index}>
            <p className="text-lg text-white font-semibold">
              Start Date: {formatTime(result.startDate)}
            </p>
            <p className="text-lg text-white font-semibold">
              End Date: {formatTime(result.endDate)}
            </p>
            <p className="text-lg text-white font-semibold">
              Amount: {result.amount}
            </p>
            <p className="text-lg text-white font-semibold">
              Claimed: {result.claimed}
            </p>
          </div>
        ))}

      <div className="flex justify-between mt-12">
        {loading ? (
          <p className="text-xl text-white font-medium animate-pulse">
            Loading...
          </p>
        ) : (
          <>
            <button
              onClick={pausePosition}
              className="bg-red-500 w-20 hover:bg-red-700 text-white py-1 rounded-lg text-center"
            >
              <p className="">Pause</p>
            </button>

            <button
              onClick={unPausePosition}
              className="bg-blue-500 w-20 hover:bg-blue-700 text-white py-1 rounded-lg text-center"
            >
              <p className="">UnPause</p>
            </button>

            <button className="bg-green-500 w-20 hover:bg-green-700 text-white py-1 rounded-lg text-center">
              <p className="">Claim Rewards</p>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
