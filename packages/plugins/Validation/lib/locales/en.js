export default {
  plugin: {
    validation: {
      required: 'The {_field_} field is required',
      integer: 'The {_field_} field must be an integer',
      minMax: '{_field_} length should be from {min} to {max} characters in length',
      minMaxValue: '{_field_} should be from {min} to {max}',
      unoque: '{_field_} must be unique',
      dateBefore: '{_field_} should be smaller than {target}',
      dateAfter: '{_field_} should be greater than {target}',
      dateBetween: {
        after: ({ named }) => `{_field_} should be after ${named('date')}`,
        before: ({ named }) => `{_field_} should be before ${named('date')}`,
        between: ({ named }) => `{_field_} should be between ${named('prev')} and ${named('next')}`
      }

    }
  }
};
