import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { EthersService } from './ethers/ethers.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly ethersService: EthersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/balance/:address')
  async getBalance(@Param('address') address: string) {
    try {
      return await this.ethersService.getBalance(address);
    } catch (error) {
      console.log(error);
      throw new HttpException('Invalid Address', 400);
    }
  }

  @Get('/token-info/:tokenAddress')
  async getTokenInfo(@Param('tokenAddress') tokenAddress: string) {
    console.log('getting request for token info');
    return this.ethersService.getTokenInfo(tokenAddress);
  }

  @Get('/token-balance/:ethereumAddress/:tokenContractAddress')
  getTokenBalance(
    @Param('ethereumAddress') ethereumAddress: string,
    @Param('tokenContractAddress') tokenContractAddress: string,
  ) {
    return this.ethersService.getTokenBalance(
      tokenContractAddress,
      ethereumAddress,
    );
  }
}
