import { startCase } from 'lodash';
import * as yup from 'yup';

const { formatError } = yup.ValidationError;
yup.ValidationError.formatError = (message, params) => {
  if (!params.label) {
    // eslint-disable-next-line no-param-reassign
    params.label = startCase(String(params.path));
  }

  return formatError.call(this, message, params);
};

export default yup;
