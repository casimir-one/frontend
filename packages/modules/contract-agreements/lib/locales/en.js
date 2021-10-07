export default {
  module: {
    contractAgreements: {
      status: {
        PROPOSED: 'Pending',
        PENDING: 'Pending',
        APPROVED: 'Approved',
        REJECTED: 'Rejected'
      },
      discard: {
        confirm: {
          title: 'Discard contract',
          message: 'Are you sure you want to discard contract?'
        },
        success: 'Contract successfully discarded!'
      },
      table: {
        discard: 'Discard',
        parties: 'Parties',
        created: 'Created',
        signed: 'Signed',
        status: 'Status'
      }
    }
  }
};
