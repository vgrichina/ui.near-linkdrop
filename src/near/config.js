const testnet = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
  accounts: {
    linkdrop: 'linkdrop.testnet',
  },
};

const mainnet = {
  networkId: 'mainnet',
  nodeUrl: 'https://rpc.mainnet.near.org',
  walletUrl: 'https://wallet.near.org',
  helperUrl: 'https://helper.mainnet.near.org',
  explorerUrl: 'https://explorer.near.org',
  accounts: {
    linkdrop: 'linkdrop.near', // TODO need to create
  },
};

const configs = {
  testnet,
  mainnet,
};

const createHelpers = (config) => ({
  getCheckAccountInExplorerUrl: (accountId) => `${config.explorerUrl}/accounts/${accountId}`,
  getCreateAccountAndClaimLink: (secretKey, campaignAccountId) =>
    `${config.walletUrl}/create/${campaignAccountId}/${secretKey}`,
});

const getNearConfig = (network) => {
  const config = configs[network];
  return {
    ...config,
    ...createHelpers(config),
  };
};

export const config = getNearConfig(process.env.REACT_APP_NETWORK);
