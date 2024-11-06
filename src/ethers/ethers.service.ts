 /* eslint-disable */ 

import { Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { TokenDetails } from 'src/interface/token-details/token-details.interface';

@Injectable()
export class EthersService {
  private provider: ethers.JsonRpcApiProvider;
  private readonly RPC_URL = 'https://rpc.public.curie.radiumblock.co/http/ethereum';
  private readonly ABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address) view returns (uint256)',
    'function decimals() view returns (uint8)',
]

  constructor() {
    this.provider = new ethers.JsonRpcProvider(this.RPC_URL);
  }

  async getBalance(ethereumAddressddress: string) {
    if (!ethers.isAddress(ethereumAddressddress)) {
        throw new Error(`Invalid ethereum address: ${ethereumAddressddress}`);
    }
    return ethers.formatEther(await this.provider.getBalance(ethereumAddressddress));
  }

  async getTokenInfo(contractAddress: string): Promise<TokenDetails> {
    const contract = new ethers.Contract(contractAddress, this.ABI, this.provider);
    const [name, symbol, supply, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.totalSupply(),
      contract.decimals(),
    ]);
    const totalSupply : string = ethers.formatUnits(supply, decimals);
    return {name, symbol, totalSupply};
  }

  async getTokenBalance(
    tokenContractAddress: string,
    ethereumAddress: string
  ) : Promise<string> {
    const contract = new ethers.Contract(tokenContractAddress, this.ABI, this.provider);
    const [symbol, balance, decimals] = await Promise.all([
      contract.symbol(),
      contract.balanceOf(ethereumAddress),
      contract.decimals(),
    ])
    const res = `${Number(ethers.formatUnits(balance, decimals)).toLocaleString()} ${symbol}`;
    return res;
  }

}
