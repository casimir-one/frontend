export default {
  module: {
    assets: {
      input: {
        amount: 'Amount',
        errors: {
          validNumber: '{_field_} must be valid number'
        }
      },
      createTokenForm: {
        submit: 'Submit',
        cancel: 'Cancel',
        title: ({ named }) => `${named('entity')} token details`,
        numberOfTokens: 'Number of tokens',
        totalNumberOfTokens: 'Total number of tokens to issue',
        ticker: 'Ticker (abbreviation)',
        tokensAmountNote: ({ named }) => `Note: 2,000 to 20,000 tokens are usualy issued per ${named('entity')}.`,
        shareholders: 'Shareholders',
        shareholder: 'Shareholder',
        addShareholder: 'Add shareholder',
        shareholdersNote: 'Note: Only tokens that belong to a team can be used for fundraising.',
        tokens: 'Tokens',
        legal: 'Legal',
        confirmation: 'Confirmation',
        agree: 'I agree to the Terms and Conditions listed below',
        understand: ({ named }) => `I understand that issued tokens will be distributed among shareholders,
        effectively transferring ownership
        over the property related to the ${named('entity')}.
        Holding a share does not grant access to participate on
        decisions related to the ${named('entity')}.
        It’s not possible to undo this action.`,
        errors: {
          tickerUnique: '{_field_} is taken. Try another.'
        }
      }
    }
  }
};
