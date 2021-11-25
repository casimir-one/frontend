export default {
  module: {
    assets: {
      input: {
        amount: 'Amount'
      },
      createTokenForm: {
        submit: 'Submit',
        cancel: 'Cancel',
        title: '{entity} token details',
        numberOfTokens: 'Number of tokens',
        totalNumberOfTokens: 'Total number of tokens to issue',
        ticker: 'Ticker (abbreviation)',
        tokensAmountNote: 'Note: 2,000 to 20,000 tokens are usualy issued per {entity}',
        shareholders: 'Shareholders',
        shareholder: 'Shareholder',
        addShareholder: 'Add shareholder',
        shareholdersNote: 'Note: Only tokens that belong to a team can be used for fundraising.',
        tokens: 'Tokens',
        legal: 'Legal',
        confirmation: 'Confirmation',
        agree: 'I agree to the {0} listed below',
        tos: 'Terms and Conditions',
        understand: `I understand that issued tokens will be distributed among shareholders,
        effectively transferring ownership
        over the property related to the {entity}.
        Holding a share does not grant access to participate on
        decisions related to the {entity}.
        It’s not possible to undo this action.`,
        errors: {
          tickerUnique: '{_field_} is taken. Try another.'
        }
      }
    }
  }
};
