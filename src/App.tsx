import React, { useState } from 'react';
import {
  Container, Box, TextField, IconButton, List,
  ListItem, ListItemText, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface Item {
  itemName: string;
  quantity: number;
  isSelected: boolean;
}

const App = () => {
  const [items, setItems] = useState<Item[]>([
    { itemName: 'item 1', quantity: 1, isSelected: false },
    { itemName: 'item 2', quantity: 3, isSelected: true },
    { itemName: 'item 3', quantity: 2, isSelected: false },
  ]);
  const [inputValue, setInputValue] = useState('');

  // Only count items that are NOT completed
  const totalItemCount = items
    .filter(item => !item.isSelected)
    .reduce((total, item) => total + item.quantity, 0);

  const handleAddItem = () => {
    // Prevent adding empty input
    if (inputValue.trim() === '') return;

    // Prevent duplicate item names
    const isDuplicate = items.some(
      item => item.itemName.toLowerCase() === inputValue.trim().toLowerCase()
    );
    if (isDuplicate) {
      alert('Item already exists!');
      return;
    }

    const newItem: Item = { itemName: inputValue.trim(), quantity: 1, isSelected: false };
    setItems([...items, newItem]);
    setInputValue('');
  };

  const handleQuantityIncrease = (index: number) => {
    const newItems = [...items];
    newItems[index].quantity++;
    setItems(newItems);
  };

  const handleQuantityDecrease = (index: number) => {
    const newItems = [...items];
    if (newItems[index].quantity > 1) newItems[index].quantity--;
    setItems(newItems);
  };

  const toggleComplete = (index: number) => {
    const newItems = [...items];
    newItems[index].isSelected = !newItems[index].isSelected;
    setItems(newItems);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🛒 Shopping List
      </Typography>

      {/* Input box to add new item */}
      <Box display="flex" gap={1} mb={2}>
        <TextField
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder="Add an item..."
          size="small"
        />
        <IconButton color="primary" onClick={handleAddItem}>
          <AddIcon />
        </IconButton>
      </Box>

      {/* Item list */}
      <List>
        {items.map((item, index) => (
          <ListItem key={index} sx={{
            border: '1px solid #eee',
            borderRadius: 2,
            mb: 1,
            opacity: item.isSelected ? 0.5 : 1
          }}>
            {/* Toggle complete button */}
            <IconButton onClick={() => toggleComplete(index)}>
              {item.isSelected
                ? <CheckCircleIcon color="success" />
                : <RadioButtonUncheckedIcon />}
            </IconButton>

            <ListItemText
              primary={item.itemName}
              sx={{ textDecoration: item.isSelected ? 'line-through' : 'none' }}
            />

            {/* Quantity controls */}
            <IconButton onClick={() => handleQuantityDecrease(index)}>
              <RemoveCircleOutlineIcon />
            </IconButton>
            <Typography>{item.quantity}</Typography>
            <IconButton onClick={() => handleQuantityIncrease(index)}>
              <AddCircleOutlineIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Total quantity (completed items excluded) */}
      <Typography variant="h6" align="right">
        Total: {totalItemCount}
      </Typography>
    </Container>
  );
};

export default App;