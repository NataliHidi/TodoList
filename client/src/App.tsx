import React from 'react';
import { ChakraProvider, Box, Text } from '@chakra-ui/react';
import TodoList from './components/TodoList';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Box maxW="600px" mx="auto" p="6">
        <Text as="h1" fontSize="2xl" mb="4">Список задач</Text>
        <TodoList />
      </Box>
    </ChakraProvider>
  );
};

export default App;