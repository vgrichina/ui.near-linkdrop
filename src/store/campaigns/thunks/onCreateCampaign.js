import { thunk } from 'easy-peasy';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { redirectActions } from '../../../config/redirectActions';
import { getRoute } from '../../../ui/config/routes';
import { sendTokens } from '../../../near/helpers/sendTokens';

const getCampaignAmount = (totalKeys, amountPerLink) => {
  // contract storage
  // key storage
  // tokens in key
  // gas fee for calling claim or create account
  const res = 2.5 + totalKeys * (Number(amountPerLink) + 0.01); // TODO change coefficients
  return parseNearAmount(res.toString());
};

export const onCreateCampaign = thunk(async (_, payload, { getStoreState, getStoreActions }) => {
  const { name: campaignName, icon, totalLinks, amountPerLink } = payload;

  const state = getStoreState();
  const wallet = state.general.entities.wallet;
  const walletUserId = state.general.user.currentAccount;
  const linkdropUserId = state.general.user.accounts[walletUserId].linkdrop.accountId;

  const actions = getStoreActions();
  const setTemporaryData = actions.general.setTemporaryData;

  // TODO Rename form fields totalLinks -> totalKeys
  const totalKeys = Number(totalLinks);
  const yoctoNearPerKey = parseNearAmount(amountPerLink);

  const campaignAmount = getCampaignAmount(totalKeys, amountPerLink);
  const redirectAction = redirectActions.createNearCampaign;

  setTemporaryData({
    redirectAction,
    campaignName,
    icon,
    yoctoNearPerKey,
    totalKeys,
    campaignAmount,
  });

  sendTokens({
    wallet,
    receiverId: linkdropUserId,
    amount: campaignAmount,
    callbackUrl: getRoute.callbackUrl({ redirectAction }),
  });
});
