import { delimiter } from './delimiter';
import { header } from './header';
import { list } from './list';
import { paragraph } from './paragraph';
import { quote } from './quote';
import { table } from './table';

const parsers = {
  delimiter,
  header,
  list,
  paragraph,
  quote,
  table
};

export { parsers };
