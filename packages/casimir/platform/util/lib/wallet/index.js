import { proxydi } from '@deip/proxydi';

const getWindowOptions = () => {
  const left = (window.screen.width - 400) / 2;
  const top = (window.screen.height - 640) / 2;

  const options = {
    popup: true,
    width: 420,
    height: 600,
    menubar: 'no',
    toolbar: 'no',

    top,
    left
  };

  return Object.keys(options)
    .reduce((acc, key) => `${acc},${key}=${options[key]}`, '');
};

export const walletSignTx = async (packedTx, chainInfo) => {
  const { WALLET_URL } = proxydi.get('env');
  const { TxClass, metadata } = chainInfo;

  const wallet = window.open(`${WALLET_URL}/sign-transaction`, '_blank', getWindowOptions());

  const signedTx = await new Promise((resolve, reject) => {
    const handleSignTx = (event) => {
      const { data } = event;

      if (data?.channel === 'Deip.Wallet.Transaction.Ready') {
        const serializedTx = packedTx.getTx().serialize();
        wallet.postMessage({ transaction: serializedTx }, '*');
      }

      if (data?.channel === 'Deip.Wallet.Transaction') {
        window.removeEventListener('message', handleSignTx);

        if (data.transaction) {
          const deserializedTx = TxClass.Deserialize(data.transaction, metadata);
          packedTx.setTx(deserializedTx);

          resolve(packedTx);
        } else {
          reject();
        }
      }

      if (data?.channel === 'Deip.Wallet.Transaction.Close') {
        window.removeEventListener('message', handleSignTx);

        reject();
      }
    };

    window.addEventListener('message', handleSignTx);
  });

  return signedTx;
};
