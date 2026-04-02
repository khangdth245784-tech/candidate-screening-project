import React, { useState, useEffect } from 'react';
import {
  Container, Box, TextField, IconButton, List,
  ListItem, ListItemText, Typography, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from './firebase';
import {
  collection, addDoc, onSnapshot,
  updateDoc, deleteDoc, doc
} from 'firebase/firestore';

interface Item {
  id: string;
  itemName: string;
  quantity: number;
  isSelected: boolean;
}

const App = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);

  // Load data from Firestore in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
      const loadedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Item[];
      setItems(loadedItems);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Only count items that are NOT completed
  const totalItemCount = items
    .filter(item => !item.isSelected)
    .reduce((total, item) => total + item.quantity, 0);

  const handleAddItem = async () => {
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

    // Add to Firestore
    await addDoc(collection(db, 'items'), {
      itemName: inputValue.trim(),
      quantity: 1,
      isSelected: false
    });
    setInputValue('');
  };

  const handleQuantityIncrease = async (item: Item) => {
    await updateDoc(doc(db, 'items', item.id), {
      quantity: item.quantity + 1
    });
  };

  const handleQuantityDecrease = async (item: Item) => {
    if (item.quantity <= 1) return;
    await updateDoc(doc(db, 'items', item.id), {
      quantity: item.quantity - 1
    });
  };

  const toggleComplete = async (item: Item) => {
    await updateDoc(doc(db, 'items', item.id), {
      isSelected: !item.isSelected
    });
  };

  const handleDelete = async (item: Item) => {
    await deleteDoc(doc(db, 'items', item.id));
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

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
        {items.map((item) => (
          <ListItem key={item.id} sx={{
            border: '1px solid #eee',
            borderRadius: 2,
            mb: 1,
            opacity: item.isSelected ? 0.5 : 1
          }}>
            {/* Toggle complete button */}
            <IconButton onClick={() => toggleComplete(item)}>
              {item.isSelected
                ? <CheckCircleIcon color="success" />
                : <RadioButtonUncheckedIcon />}
            </IconButton>

            <ListItemText
              primary={item.itemName}
              sx={{ textDecoration: item.isSelected ? 'line-through' : 'none' }}
            />

            {/* Quantity controls */}
            <IconButton onClick={() => handleQuantityDecrease(item)}>
              <RemoveCircleOutlineIcon />
            </IconButton>
            <Typography>{item.quantity}</Typography>
            <IconButton onClick={() => handleQuantityIncrease(item)}>
              <AddCircleOutlineIcon />
            </IconButton>

            {/* Delete button */}
            <IconButton onClick={() => handleDelete(item)} color="error">
              <DeleteIcon />
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