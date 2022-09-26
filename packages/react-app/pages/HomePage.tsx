import React, { useState, useEffect } from "react";
import { useCelo } from "@celo/react-celo";
import { StakePIR } from "@celo-composer/hardhat/types/StakePIR";
import { PironToken } from "@celo-composer/hardhat/types/PironToken";
// import FeedList from "../components/FeedList";
import Link from "next/link";
import { Input } from "@/components/Input";
// import { error } from "../utils/response";
// import "react-toastify/dist/ReactToastify.css";

export default function HomePage({ contracts }) {
  const { kit, address } = useCelo();
  const [loading, setLoading] = useState(false);
  const [loadingArray] = useState(15);

  // Create a state variable to store the feeds in the blockchain
  const [feeds, setFeeds] = useState<any>([]);
  const [amount, setAmount] = useState<any>([]);

  const pironContract = contracts
    ? (new kit.connection.web3.eth.Contract(
        contracts.PironToken.abi,
        contracts.PironToken.address
      ) as any as PironToken)
    : null;

  const stakingContract = contracts
    ? (new kit.connection.web3.eth.Contract(
        contracts.StakePIR.abi,
        contracts.StakePIR.address
      ) as any as StakePIR)
    : null;

  const handleChange = (e: { target: { value: any } }, name: any) => {
    setAmount(e.target.value);
  };

  const Submit = async () => {
    const gasPriceMinimumContract = await kit.contracts.connection.gasPrice();
    const formatAmount = kit.connection.web3.utils.toHex(amount);
    await pironContract.methods
      .approve(contracts.StakePIR.address, "100000000")
      .send({ from: address });
    console.log("first");

    await stakingContract.methods
      .stakeToken(formatAmount)
      .send({ from: address, gas: "1000000" });
    console.log("second");
  };

  const CheckIf = async () => {
    try {
      const result = await stakingContract.methods.totalStakers().call();
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full  flex flex-row">
      <div>
        <p>Stake</p>
        <Input
          placeholder="Stake Token"
          name="stake"
          type="text"
          handleChange={handleChange}
        />
        <button onClick={Submit}>Submit</button>
        <button onClick={CheckIf}>check </button>
      </div>
    </div>
  );
}

const Loader = () => {
  return (
    <div className="flex flex-col m-5 animate-pulse">
      <div className="w-full bg-gray-300 dark:bg-borderGray h-40 rounded-lg "></div>
      <div className="w-50 mt-3 bg-gray-300 dark:bg-borderGray h-6 rounded-md "></div>
      <div className="w-24 bg-gray-300 h-3 dark:bg-borderGray mt-3 rounded-md "></div>
    </div>
  );
};
