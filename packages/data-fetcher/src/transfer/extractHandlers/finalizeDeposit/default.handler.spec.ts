import { types } from "zksync-ethers";
import { mock } from "jest-mock-extended";
import { BlockchainService } from "../../../blockchain/blockchain.service";
import { ZERO_HASH_64 } from "../../../constants";
import { TransferType } from "../../transfer.service";
import { TokenType } from "../../../token/token.service";
import { defaultFinalizeDepositHandler } from "./default.handler";
import { BASE_TOKEN_ADDRESS } from "../../../../src/constants";

describe("defaultFinalizeDepositHandler", () => {
  let log: types.Log;
  let blockDetails: types.BlockDetails;
  let blockchainService: BlockchainService;
  beforeEach(() => {
    log = mock<types.Log>({
      transactionIndex: 1,
      blockNumber: 3233097,
      transactionHash: "0x5e018d2a81dbd1ef80ff45171dd241cb10670dcb091e324401ff8f52293841b0",
      address: "0xc7e0220d02d549c4846A6EC31D89C3B670Ebe35C",
      topics: [
        "0xb84fba9af218da60d299dc177abd5805e7ac541d2673cbee7808c10017874f63",
        "0x000000000000000000000000c7e0220d02d549c4846A6EC31D89C3B670Ebe35C",
        "0x000000000000000000000000c7e0220d02d549c4846A6EC31D89C3B670Ebe35C",
        "0x000000000000000000000000dc187378edD8Ed1585fb47549Cc5fe633295d571",
      ],
      data: "0x000000000000000000000000000000000000000000000000016345785d8a0000",
      index: 13,
      blockHash: "0xdfd071dcb9c802f7d11551f4769ca67842041ffb81090c49af7f089c5823f39c",
    });
    blockDetails = mock<types.BlockDetails>({
      timestamp: new Date().getTime() / 1000,
    });
    blockchainService = mock<BlockchainService>();
  });

  describe("matches", () => {
    it("returns true", () => {
      const result = defaultFinalizeDepositHandler.matches(null);
      expect(result).toBe(true);
    });
  });

  describe("extract", () => {
    it("extracts transfer with from field populated with lower cased l1Sender", async () => {
      const result = await defaultFinalizeDepositHandler.extract(log, blockchainService, blockDetails);
      expect(result.from).toBe("0xc7e0220d02d549c4846a6ec31d89c3b670ebe35c");
    });

    it("extracts transfer with to field populated with lower cased l2Receiver", async () => {
      const result = await defaultFinalizeDepositHandler.extract(log, blockchainService, blockDetails);
      expect(result.to).toBe("0xc7e0220d02d549c4846a6ec31d89c3b670ebe35c");
    });

    it("extracts transfer with populated transactionHash", async () => {
      const result = await defaultFinalizeDepositHandler.extract(log, blockchainService, blockDetails);
      expect(result.transactionHash).toBe("0x5e018d2a81dbd1ef80ff45171dd241cb10670dcb091e324401ff8f52293841b0");
    });

    it("extracts transfer with populated blockNumber", async () => {
      const result = await defaultFinalizeDepositHandler.extract(log, blockchainService, blockDetails);
      expect(result.blockNumber).toBe(3233097);
    });

    it("extracts transfer with populated amount", async () => {
      const result = await defaultFinalizeDepositHandler.extract(log, blockchainService, blockDetails);
      expect(result.amount).toStrictEqual(BigInt("0x016345785d8a0000"));
    });

    it("extracts transfer with L2_ETH_TOKEN_ADDRESS as a tokenAddress if l2Token is 0x0000000000000000000000000000000000000000", async () => {
      log = mock<types.Log>({
        ...log,
        topics: log.topics.map((val, index) => (index === 3 ? ZERO_HASH_64 : val)),
      });
      const result = await defaultFinalizeDepositHandler.extract(log, blockchainService, blockDetails);
      expect(result.tokenAddress).toBe(BASE_TOKEN_ADDRESS);
      expect(result.tokenType).toBe(TokenType.BaseToken);
    });

    it("extracts transfer with tokenAddress field populated with lower cased l2Token", async () => {
      const result = await defaultFinalizeDepositHandler.extract(log, blockchainService, blockDetails);
      expect(result.tokenAddress).toBe("0xdc187378edd8ed1585fb47549cc5fe633295d571");
      expect(result.tokenType).toBe(TokenType.ERC20);
    });

    it("extracts transfer of deposit type", async () => {
      const result = await defaultFinalizeDepositHandler.extract(log, blockchainService, blockDetails);
      expect(result.type).toBe(TransferType.Deposit);
    });

    it("adds isFeeOrRefund as false", async () => {
      const result = await defaultFinalizeDepositHandler.extract(log, blockchainService, blockDetails);
      expect(result.isFeeOrRefund).toBe(false);
    });

    it("extracts transfer with logIndex populated from log", async () => {
      const result = await defaultFinalizeDepositHandler.extract(log, blockchainService, blockDetails);
      expect(result.logIndex).toBe(log.index);
    });

    it("extracts transfer with transactionIndex populated from log", async () => {
      const result = await defaultFinalizeDepositHandler.extract(log, blockchainService, blockDetails);
      expect(result.transactionIndex).toBe(log.transactionIndex);
    });

    it("extracts transfer with block timestamp", async () => {
      const result = await defaultFinalizeDepositHandler.extract(log, blockchainService, blockDetails);
      expect(result.timestamp).toEqual(new Date(blockDetails.timestamp * 1000));
    });

    describe("when transaction details are specified", () => {
      const receivedAt = new Date();
      const transactionDetails = mock<types.TransactionDetails>();
      transactionDetails.receivedAt = receivedAt;

      it("extracts transfer with timestamp equals to transaction receivedAt", async () => {
        const result = await defaultFinalizeDepositHandler.extract(
          log,
          blockchainService,
          blockDetails,
          transactionDetails
        );
        expect(result.timestamp).toBe(receivedAt);
      });
    });
  });
});
