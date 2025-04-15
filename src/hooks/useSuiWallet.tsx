
import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface WalletData {
  address: string | null;
  balance: any | null;
  objects: any[] | null;
  transactions: any[] | null;
  network: string;
  isLoading: boolean;
  error: string | null;
}

export const useSuiWallet = (network: string = 'testnet') => {
  const { account, connected } = useWallet();
  const { user } = useAuth();
  const [walletData, setWalletData] = useState<WalletData>({
    address: null,
    balance: null,
    objects: null,
    transactions: null,
    network,
    isLoading: false,
    error: null
  });

  const fetchWalletData = useCallback(async () => {
    if (!connected || !account?.address) {
      setWalletData(prev => ({
        ...prev,
        address: null,
        balance: null,
        objects: null,
        transactions: null,
        isLoading: false,
        error: null
      }));
      return;
    }

    setWalletData(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke('getWalletInfo', {
        body: JSON.stringify({
          walletAddress: account.address,
          network
        })
      });

      if (error) throw error;

      setWalletData({
        address: account.address,
        balance: data.balance,
        objects: data.objects,
        transactions: data.transactions,
        network,
        isLoading: false,
        error: null
      });

      // Update user profile with wallet address if logged in
      if (user) {
        await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            wallet_address: account.address,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setWalletData(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch wallet data'
      }));
      toast({
        title: 'Error',
        description: 'Failed to fetch wallet data. Please try again.',
        variant: 'destructive'
      });
    }
  }, [connected, account, network, user]);

  // Fetch wallet data on initial load and when wallet or network changes
  useEffect(() => {
    if (connected && account?.address) {
      fetchWalletData();
    }
  }, [connected, account, network, fetchWalletData]);

  // Function to manually refresh wallet data
  const refreshWalletData = () => {
    fetchWalletData();
  };

  return {
    ...walletData,
    refreshWalletData
  };
};
