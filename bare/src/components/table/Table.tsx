import View, { ViewProps } from "../view/index.js";
import Text from "../text/index.js";

type FieldDefinition<T> = {
  key: keyof T,
  label: string,
  render?: (item: T) => React.ReactNode,
};

type Record = {
  name: string,
  scienceName: string,
};

const columns: FieldDefinition<Record>[] = [
  { key: 'name', label: 'Animal' },
  { key: 'scienceName', label: 'Scientific Name' },
];

const rows: Record[] = [
  { name: 'Tiger', scienceName: 'Panthera Tigris' },
  { name: 'Wolf', scienceName: 'Canis lupus' },
];

type TableProps = {
  borderless?: boolean,
} & ViewProps;

const Table = ({
  borderless,
  ...props
}: TableProps) => {
  return (
    <View as="table" border={!borderless} style={{ display: 'table', borderSpacing: 0 }} {...props}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={column.key} style={{ padding: 0 }}>
              <Text
                caps
                fontSize="xxsmall"
                fontWeight="semibold"
                textColor="gray-6"
                textAlign="left"
                padding={borderless ? 'medium none' : 'medium large'}
                fillColor={!borderless ? "gray-2" : undefined}
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
              <td style={{ borderBottom: borderless || index !== rows.length - 1 ? '1px solid lightgray' : undefined }}>
                <Text padding={borderless ? 'medium none' : 'medium large'}>{row[column.key]}</Text>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </View>
  );
};

export default Table;
