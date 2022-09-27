import React, { useState, useEffect } from "react";
import { useCelo } from "@celo/react-celo";
import { StakePIR } from "@celo-composer/hardhat/types/StakePIR";
import { PironToken } from "@celo-composer/hardhat/types/PironToken";
import { Input } from "@/components/Input";
import { truncateAddress } from "@/utils";
import { Button } from "@mui/material";
import { ProjectCard } from "@/components/ProjectCard";
// import { error } from "../utils/response";
// import "react-toastify/dist/ReactToastify.css";

export default function HomePage({ contracts }) {
  const { kit, address } = useCelo();
  const [loading, setLoading] = useState(false);

  // Create a state variable to store the feeds in the blockchain
  const [error, setError] = useState<any>();
  const [success, setSuccess] = useState<boolean>(false);
  const [amount, setAmount] = useState<any>([]);
  const [results, setResults] = useState<any>([]);

  useEffect(() => {
    const pullData = async () => {
      fetchPositions();
    };
    pullData();
  }, []);

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

  const fetchPositions = async () => {
    const data2 = [];
    const totalStake = await stakingContract.methods.totalStakers().call();
    const planExpire = await stakingContract.methods.planExpired().call();
    const interestRate = await stakingContract.methods.interestRate().call();
    const paused = await stakingContract.methods.paused().call();
    const owner = await stakingContract.methods.owner().call();

    const structuredData = {
      totalStakers: totalStake,
      planExpires: planExpire,
      interestRate: interestRate,
      paused: paused.toString(),
      owner: owner,
    };

    data2.push(structuredData);
    setResults(data2);
    console.log("result", results);
  };

  const Submit = async () => {
    const formatAmount = kit.connection.web3.utils.toHex(amount);
    try {
      setLoading(true);
      await pironContract.methods
        .approve(contracts.StakePIR.address, "100000000")
        .send({ from: address });
      console.log("first");

      await stakingContract.methods
        .stakeToken(formatAmount)
        .send({ from: address, gas: "1000000" });
      setLoading(false);
      console.log("second");
      setSuccess(true);
    } catch (err) {
      console.log(err.data);
      setError(err);
    }
  };

  const fetchInfo = async () => {
    const result = await stakingContract.methods.stakeInfos(address).call();
    console.log(result);
  };

  return (
    <div className="h-screen flex-1 flex flex-col">
      <div className="flex justify-between">
        <div className="w-7/12 my-20">
          <p className="text-xl font-semibold text-center text text-white">
            Earn amazing returns on your Piron tokens when you stake them on
            Piron staking dapp. Built using Celo Composer.
          </p>
        </div>

        <div className="p-3 mr-12 flex-col rounded-xl h-72 sm:w-72  w-full my-5 eth-card white-glassmorphism">
          <div className="flex flex-col w-full h-full">
            <div>
              <p className="text-white font-light text-sm">
                {truncateAddress(address)}
              </p>
              <p className="text-white font-semibold text-lg mt-1">
                Stake your PTK tokens
              </p>

              <Input
                placeholder=""
                name="stake"
                type="text"
                handleChange={handleChange}
              />
              <div className="text-red-800 ml-14">
                <Button color="inherit" variant="contained" onClick={Submit}>
                  Stake Tokens
                </Button>
              </div>
            </div>
            <div className="mt-3">
              {loading ? (
                <p className="text-xl text-white font-medium animate-pulse">
                  Loading...
                </p>
              ) : null}

              {error ? (
                <div className="items-center flex flex-col">
                  <p className="text-xl text-red-800 font-medium">
                    {error.data}
                  </p>

                  <Button
                    color="inherit"
                    variant="contained"
                    onClick={() => {
                      setError("");
                      setSuccess(false);
                    }}
                  >
                    okay
                  </Button>
                </div>
              ) : null}

              {success ? (
                <div className="items-center flex flex-col">
                  <p className="text-xl text-green-800 font-medium px-4">
                    Success!
                  </p>

                  <Button
                    color="inherit"
                    variant="contained"
                    onClick={() => {
                      setError("");
                      setSuccess(false);
                    }}
                  >
                    okay
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="blue-glassmorphism gradient-bg-transactions bg-gray-800">
        <div className="flex flex-col md:p-12 py-12 px-4">
          {address ? (
            <>
              <h3 className="text-white text-3xl text-center my-2">
                Latest Positions
              </h3>
              {results.map((result, index) => (
                <ProjectCard
                  key={index}
                  results={result}
                  contracts={contracts}
                />
              ))}
            </>
          ) : (
            <h3 className="text-white text-3xl text-center my-2">
              Connect your account
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}
