export default {
  module: {
    fundraising: {
      createForm: {
        cancel: 'Cancel',
        start: 'Start',
        determineNumberOfTokens: 'Determine the number of security token units',
        units: 'Units',
        selectDates: 'Select start and end dates of fundraise',
        startDate: 'Start date',
        endDate: 'End date',
        selectAmounts: 'Select min and max amounts',
        min: 'Min',
        max: 'Max',
        validations: {
          assetSmaller: '{_field_} should be smaller than {target}',
          assetGreater: '{_field_} should be greater than {target}'
        }
      },
      amountSelector: {
        enterAmount: 'Enter amount'
      },
      fundraisingProgress: {
        goal: 'Goal',
        collected: 'Collected',
        untilCompletion: 'Until completion',
        investors: 'Investors'
      },
      contributeForm: {
        title: 'Your investment',
        cancel: 'Cancel',
        invest: 'Invest',
        amount: 'Amount',
        agree: 'I have read the terms of the {0} and understand that the investment is associated with the risk of non-return of the invested funds',
        tos: 'User Agreement',
        userBalanceIsNotEnough: 'You do not have enough funds in your account',
        confirmTitle: 'Investment confirmation',
        doYouConfirm: 'Do you confirm the investment of funds from your account?'
      }
    }
  }
};
