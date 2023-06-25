import { createUseStyles } from 'react-jss';

import View, { ViewProps } from "../view/index.js";
import Text from "../text/index.js";
import clsx from 'clsx';

type FieldDefinition<T> = {
  key: keyof T,
  label: string,
  render?: (item: T) => React.ReactNode,
};

type Record = {
  name: string,
  scienceName: string,
  kingdom: string,
  order: string,
};

const columns: FieldDefinition<Record>[] = [
  { key: 'name', label: 'Animal' },
  { key: 'scienceName', label: 'Scientific Name' },
  { key: 'kingdom', label: 'Kingdom' },
  { key: 'order', label: 'Order' }
];

const rows: Record[] = [
  { name: 'Tiger', scienceName: 'Panthera Tigris', kingdom: 'Animalia', order: 'Carnivora' },
  { name: 'Wolf', scienceName: 'Canis lupus', kingdom: 'Animalia', order: 'Carnivora' },
  { name: 'Monkey', scienceName: 'Cercopithecidae', kingdom: 'Animalia', order: 'Primates' },
];


const useStyles = createUseStyles({
  Table: {

  },
  Row: {
  },
  Cell: {
  },
  Header: {
    padding: '20px 0 8px 16px',
  },
  Text: {
    padding: '12px 0 12px 16px',
  },
  borderless: {
    '& $Cell:first-child $Header, & $Cell:first-child $Text': {
      paddingLeft: 0,
    },
    '& $Cell $Header': {
      paddingTop: 0,
    },
  }
});

type TableProps = {
  borderless?: boolean,
} & ViewProps;

const Table = ({
  borderless,
  ...props
}: TableProps) => {
  const styles = useStyles();

  const tableClassName = clsx(
    styles.Table,
    borderless && styles.borderless,
  );

  return (
    <View as="table" border={!borderless} className={tableClassName} style={{ display: 'table', borderCollapse: 'collapse', borderSpacing: 0 }} {...props}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={column.key} className={styles.Cell} style={{ padding: 0, borderBottom: '1px solid hsla(0, 0%, 0%, 0.15)' }}>
              <Text
                caps
                fontSize="xxsmall"
                fontWeight="semibold"
                textColor="gray-6"
                textAlign="left"
                fillColor={!borderless ? "gray-1" : undefined}
                className={styles.Header}
              >
                {column.label}
              </Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr>
            {columns.map((column) => (
              <td className={styles.Cell} style={{ borderBottom: borderless || index !== rows.length - 1 ? '1px solid hsla(0, 0%, 0%, 0.15)' : undefined }}>
                <Text className={styles.Text}>{row[column.key]}</Text>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </View>
  );
};

export default Table;
