import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, toggleTodo, deleteTodo, editTodo, reorderTodos, Todo } from '../features/todoSlice';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RootState } from '../features/store';

const TodoList: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      JSON.parse(storedTodos).forEach((todo: Todo) => dispatch(addTodo(todo.text)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    if (inputValue.trim() !== '') {
      dispatch(addTodo(inputValue.trim()));
      setInputValue('');
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditId(todo.id);
    setInputValue(todo.text);
  };

  const handleUpdate = () => {
    if (editId && inputValue) {
      dispatch(editTodo({ id: editId, text: inputValue }));
      setInputValue('');
      setEditId(null);
    }
  };

  const handleDelete = (id: number) => {
    dispatch(deleteTodo(id));
  };

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedTodos = Array.from(todos);
    const [movedItem] = reorderedTodos.splice(result.source.index, 1);
    reorderedTodos.splice(result.destination.index, 0, movedItem);
    dispatch(reorderTodos(reorderedTodos));
  };

  return (
    <Box>
      <Input 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)} 
        placeholder="Добавить задачу" 
      />
      <Button onClick={editId ? handleUpdate : handleAdd}>
        {editId ? 'Обновить' : 'Добавить'}
      </Button>
      
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="todoList">
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={String(todo.id)} index={index}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      border="1px solid"
                      padding="4"
                      margin="4"
                    >
                      <Text 
  
                        textDecoration={todo.completed ? 'line-through' : 'none'}
                      >
                        {todo.text}
                      </Text>
                      <Button onClick={() => dispatch(toggleTodo(todo.id))}>Выполнено</Button>
                      <Button onClick={() => handleEdit(todo)}>Редактировать</Button>
                      <Button onClick={() => handleDelete(todo.id)}>Удалить</Button>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default TodoList;