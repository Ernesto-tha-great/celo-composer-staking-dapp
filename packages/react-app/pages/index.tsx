import * as React from "react";
import { Tabs, Tab, Typography, Box } from "@mui/material";
import deployedContracts from "@celo-composer/hardhat/deployments/hardhat_contracts.json";
import { useCelo } from "@celo/react-celo";
import AppLayout from "@/components/layout/AppLayout";
import { useEffect } from "react";
import HomePage from "./HomePage";

export default function App() {
  const { network } = useCelo();

  const contracts =
    deployedContracts[network?.chainId?.toString()]?.[
      network?.name?.toLocaleLowerCase()
    ]?.contracts;

  return (
    <AppLayout title="Celo Starter" description="Celo Starter">
      <HomePage contracts={contracts} />
    </AppLayout>
  );
}
