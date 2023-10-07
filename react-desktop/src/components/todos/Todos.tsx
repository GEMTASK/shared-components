import { View, Checkbox, Stack, Spacer } from 'bare';
import { useState } from 'react';

const initialState = [
  { id: 0, title: 'Function pattern', done: true },
  { id: 1, title: 'Array rest synta', done: true },
  { id: 2, title: 'Dict pattern matching', done: false },
  { id: 3, title: 'BigInt', done: false },
  { id: 4, title: 'IndexDB', done: false },
  { id: 5, title: 'LocalStorage', done: false },
  { id: 6, title: 'TypedArray (Vector)', done: true },
  { id: 7, title: 'Enumerations', done: false },
  { id: 8, title: 'Fix leaky JS types', done: false },
  { id: 8, title: 'Desktop dark mode', done: false },
];

const Todos = ({ ...props }) => {
  const [todos, setTodos] = useState(initialState);

  return (
    <View {...props}>
      <Stack divider dividerInset={48} spacing="small" padding="large none" style={{ overflow: 'auto' }}>
        {todos.map(({ id, title, done }) => (
          <View horizontal>
            <Spacer size="large" />
            <Checkbox
              flex
              label={title}
              value={done}
              onValueChange={value => setTodos(todos => todos.map(todo => todo.id === id ? ({
                ...todo,
                done: value
              }) : todo))}
            />
          </View>
        ))}
      </Stack>
    </View>
  );
};

export default Todos;
