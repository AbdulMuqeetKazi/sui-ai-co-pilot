
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { SuiClient, getFullnodeUrl } from 'npm:@mysten/sui.js@0.47.0/client'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { walletAddress, network = 'testnet', includeTransactions = true } = await req.json()
    
    if (!walletAddress) {
      throw new Error('Wallet address is required')
    }

    // Connect to Sui network
    const rpcUrl = getFullnodeUrl(network as any)
    const client = new SuiClient({ url: rpcUrl })

    // Get balance
    const balance = await client.getBalance({
      owner: walletAddress,
    })

    // Get owned objects (limited to first 50)
    const objects = await client.getOwnedObjects({
      owner: walletAddress,
      limit: 50,
    })

    // Structure the response
    const response: Record<string, any> = {
      balance,
      objects: objects.data,
      network
    }

    // Get recent transactions if requested
    if (includeTransactions) {
      const transactions = await client.queryTransactionBlocks({
        filter: {
          FromAddress: walletAddress
        },
        limit: 10,
      })
      response.transactions = transactions.data
    }

    // Get coin metadata for better display
    try {
      if (balance.coinObjects && balance.coinObjects.length > 0) {
        const coinTypes = [...new Set(balance.coinObjects.map(coin => coin.coinType))]
        response.coinMetadata = {}
        
        for (const coinType of coinTypes) {
          try {
            const metadata = await client.getCoinMetadata({ coinType })
            if (metadata) {
              response.coinMetadata[coinType] = metadata
            }
          } catch (error) {
            console.error(`Error fetching metadata for ${coinType}:`, error)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching coin metadata:', error)
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in getWalletInfo function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
