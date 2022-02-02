export default {
  module: {
    contractAgreements: {
      status: {
        PROPOSED: 'Pending',
        PENDING: 'Pending',
        APPROVED: 'Approved',
        REJECTED: 'Rejected'
      },
      discard: 'Discard',
      discardAction: {
        confirm: {
          title: 'Discard contract',
          message: 'Are you sure you want to discard contract?'
        },
        success: 'Contract successfully discarded!'
      },
      signAction: {
        confirm: {
          title: 'Accept and sign contract',
          message: 'Are you sure you want to accept and sign contract?'
        },
        success: 'Contract successfully signed!'
      },
      table: {
        parties: 'Parties',
        created: 'Created',
        signed: 'Signed',
        status: 'Status'
      },
      details: {
        sign: 'Accept and Sign',
        agreementMessage: 'I have read the terms of the {0}',
        tos: 'User Agreement',
        noFile: 'No file'
      }
    }
  }
};
