
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NETWORKS } from '@/lib/sui-client';

interface SuiNetworkSelectorProps {
  network: string;
  onNetworkChange: (network: string) => void;
}

const SuiNetworkSelector = ({ network, onNetworkChange }: SuiNetworkSelectorProps) => {
  const networks = [
    { id: NETWORKS.MAINNET, name: 'Mainnet' },
    { id: NETWORKS.TESTNET, name: 'Testnet' },
    { id: NETWORKS.DEVNET, name: 'Devnet' },
    { id: NETWORKS.LOCAL, name: 'Local' },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Network</CardTitle>
        <CardDescription>Select a Sui network to connect to</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={network} onValueChange={onNetworkChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select network" />
          </SelectTrigger>
          <SelectContent>
            {networks.map((n) => (
              <SelectItem key={n.id} value={n.id}>
                {n.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default SuiNetworkSelector;
