/* eslint-disable @typescript-eslint/no-explicit-any */

import { computed, ref } from "vue";

import { vi } from "vitest";

import * as useBatches from "@/composables/useBatches";
import * as useBlocks from "@/composables/useBlocks";
import * as useContext from "@/composables/useContext";
import * as useContractEvents from "@/composables/useContractEvents";
import * as useContractInteractionFactory from "@/composables/useContractInteraction";
import * as useTokenFactory from "@/composables/useToken";
import * as useTokenLibraryMockFactory from "@/composables/useTokenLibrary";
import * as useTransaction from "@/composables/useTransaction";
import * as useTransactions from "@/composables/useTransactions";
import * as useTransfers from "@/composables/useTransfers";
import * as useWalletModule from "@/composables/useWallet";

import type { NetworkConfig } from "@/configs";
import type { Provider } from "zksync-web3";

import { checksumAddress } from "@/utils/formatters";

export const ETH_TOKEN_MOCK = {
  address: checksumAddress("0x000000000000000000000000000000000000800A"),
  l1Address: checksumAddress("0x0000000000000000000000000000000000000000"),
  l2Address: checksumAddress("0x000000000000000000000000000000000000800A"),
  symbol: "ETH",
  name: "Ether",
  decimals: 18,
  liquidity: 220000000000,
  usdPrice: 1800,
  iconURL: null,
};

export const TESTNET_NETWORK: NetworkConfig = {
  name: "testnet",
  verificationApiUrl: "https://zksync2-testnet-explorer.zksync.dev",
  apiUrl: "https://block-explorer-api.testnets.zksync.dev",
  icon: "",
  l2ChainId: 300,
  rpcUrl: "",
  l2NetworkName: "Testnet",
  l1ExplorerUrl: "http://testnet-block-explorer",
  maintenance: false,
  published: true,
  hostnames: [],
};
export const TESTNET_BETA_NETWORK: NetworkConfig = {
  name: "testnet-beta",
  verificationApiUrl: "https://zksync2-testnet-explorer.zksync.dev",
  apiUrl: "https://block-explorer-api.mock.zksync.dev",
  icon: "",
  l2ChainId: 270,
  rpcUrl: "",
  l2NetworkName: "Testnet Beta",
  l1ExplorerUrl: "http://testnet-beta-block-explorer",
  maintenance: false,
  published: true,
  hostnames: ["https://testnet-beta.staging-scan-v2.zksync.dev/"],
};

export const useContractEventsMock = (params: any = {}) => {
  const mockContractEvent = vi.spyOn(useContractEvents, "default").mockReturnValue({
    total: ref(0),
    collection: ref([]),
    getCollection: () => vi.fn(),
    isRequestFailed: ref(false),
    isRequestPending: ref(false),
    ...params,
  });

  return mockContractEvent;
};
export const useWalletMock = (params: any = {}) => {
  const mockWallet = {
    currentNetwork: computed(() => ({
      chainName: TESTNET_NETWORK.name,
      explorerUrl: TESTNET_NETWORK.hostnames[0],
      l1ChainId: 5,
      l2ChainId: TESTNET_NETWORK.l2ChainId,
      rpcUrl: TESTNET_NETWORK.rpcUrl,
    })),
    getL2Provider: vi.fn(() => undefined as unknown as Provider),
    getL2Signer: vi.fn(async () => undefined),
    address: ref(null),
    isConnected: computed(() => false),
    connect: vi.fn(),
    disconnect: vi.fn(),
    switchNetwork: vi.fn(),
    initialize: vi.fn(),
    isReady: ref(true),
    isMetamaskInstalled: ref(true),
    isConnectPending: ref(false),
    isConnectFailed: ref(false),
    ...params,
  };

  return vi.spyOn(useWalletModule, "useWallet").mockReturnValue(mockWallet);
};

export const useContractInteractionMock = (params: any = {}) => {
  const mockContractInteraction = vi.spyOn(useContractInteractionFactory, "default").mockReturnValue({
    ...useContractInteractionFactory.default(),
    ...params,
  });
  return mockContractInteraction;
};

export const useTokenMock = (params: any = {}) => {
  const mockToken = vi.spyOn(useTokenFactory, "default").mockReturnValue({
    ...useTokenFactory.default(),
    getTokenInfo: () => undefined,
    ...params,
  });
  return mockToken;
};

export const useTokenLibraryMock = (params: any = {}) => {
  const mockToken = vi.spyOn(useTokenLibraryMockFactory, "default").mockReturnValue({
    ...useTokenLibraryMockFactory.default(),
    ...params,
  });
  return mockToken;
};

export const useBlocksMock = (params: any = {}) => {
  const mockBlocks = vi.spyOn(useBlocks, "default").mockReturnValue({
    data: ref([]),
    total: ref(0),
    load: () => vi.fn(),
    pending: ref(false),
    failed: ref(false),
    page: ref(1),
    pageSize: ref(10),
    ...params,
  });
  return mockBlocks;
};
export const useBatchesMock = (params: any = {}) => {
  const mockBatches = vi.spyOn(useBatches, "default").mockReturnValue({
    data: ref([]),
    total: ref(0),
    load: () => vi.fn(),
    pending: ref(false),
    failed: ref(false),
    page: ref(1),
    pageSize: ref(10),
    ...params,
  });
  return mockBatches;
};

export const useTransfersMock = (params: any = {}) => {
  const mockBatches = vi.spyOn(useTransfers, "default").mockReturnValue({
    data: ref([]),
    load: () => vi.fn(),
    pending: ref(false),
    failed: ref(false),
    pageSize: computed(() => 10),
    ...params,
  });
  return mockBatches;
};

export const useTransactionsMock = (params: any = {}) => {
  const mockTransactions = vi.spyOn(useTransactions, "default").mockReturnValue({
    data: ref([]),
    load: () => vi.fn(),
    pending: ref(false),
    failed: ref(false),
    pageSize: computed(() => 10),
    ...params,
  });

  return mockTransactions;
};

export const useTransactionMock = (params: any = {}) => {
  const mockTransaction = vi.spyOn(useTransaction, "default").mockReturnValue({
    transaction: ref(null),
    isRequestPending: ref(false),
    isRequestFailed: ref(false),
    getByHash: async () => vi.fn(),

    ...params,
  });

  return mockTransaction;
};

export const useContextMock = (params: any = {}) => {
  const mockContextConfig = vi.spyOn(useContext, "default").mockReturnValue({
    getL2Provider: () => vi.fn(() => null),
    currentNetwork: computed(() => TESTNET_NETWORK),
    identifyNetwork: () => undefined,
    isReady: computed(() => true),
    networks: computed(() => [TESTNET_NETWORK]),
    ...params,
  });

  return mockContextConfig;
};
