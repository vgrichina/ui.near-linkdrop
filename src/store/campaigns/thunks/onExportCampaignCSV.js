import dateFormat from 'dateformat';
import { thunk } from 'easy-peasy';
import { CsvBuilder } from 'filefy';
import { getKeysFromMnemonic } from '../helpers/getKeysFromMnemonic';
import { config } from '../../../near/config';

export const onExportCampaignCSV = thunk(async (_, payload, { getStoreState, getStoreActions }) => {
  const { campaignId } = payload;

  const state = getStoreState();
  const walletUserId = state.general.user.currentAccount;
  const mnemonic = state.general.user.accounts[walletUserId].linkdrop.mnemonic;
  const total = state.campaigns.map[campaignId].keysStats.total;
  const name = state.campaigns.map[campaignId].name;

  const actions = getStoreActions();
  const enableLoading = actions.general.enableLoading;
  const disableLoading = actions.general.disableLoading;

  enableLoading();

  const start = 1;
  const end = total;

  const keys = await getKeysFromMnemonic({ mnemonic, start, end });

  const date = dateFormat(Date.now(), 'd_mmm_yyyy-HH_MM_ss');
  const fileName = `${name}[${start}-${end}][${date}.csv`;
  const csvBuilder = new CsvBuilder(fileName).setColumns(['order', 'public key', 'link']);

  keys.forEach(({ pk, sk, order }) => {
    csvBuilder.addRow([`#${order}`, pk, config.getCreateAccountAndClaimLink(sk, campaignId)]);
  });

  csvBuilder.exportFile();
  disableLoading();
});
