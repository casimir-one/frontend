export default {
  plugin: {
    validation: {
      required: 'The {_field_} field is required',
      integer: 'The {_field_} field must be an integer',
      minMax: '{_field_} length should be from {min} to {max} characters in length',
      minMaxValue: '{_field_} should be from {min} to {max}',
      minValue: '{_field_} should be greater than {target}',
      maxValue: '{_field_} should be less than {target}',
      unique: '{_field_} must be unique',
      dateBefore: '{_field_} should be before {target}',
      dateAfter: '{_field_} should be after {target}',
      dateAfterNow: '{_field_} should be later than now',
      dateBetween: {
        after: '{_field_} should be after {date}',
        before: '{_field_} should be before {date}',
        between: '{_field_} should be between {prev} and {next}'
      },
      number: '{_field_} must be valid number',
      equal: '{_field_} must be identical',
      equalWithLabel: '{_field_} must be equal to field {label}'

    }
  }
};
