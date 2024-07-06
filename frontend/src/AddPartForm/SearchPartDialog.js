import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, CircularProgress, TextField } from '@mui/material';
import axios from 'axios';
import Config from '../../Config';

export default function SearchPartDialog({ open, onClose, onSelect }) {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await axios.get(Config.api_url + '/getInventory');
        setParts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching parts:', error);
        setLoading(false);
      }
    };

    if (open) {
      setLoading(true);
      fetchParts();
    }
  }, [open]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredParts = parts.filter(part => 
    part.partName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select a Part</DialogTitle>
      <DialogContent>
        <TextField
          label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          margin="normal"
        />
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {filteredParts.map((part) => (
              <ListItem button onClick={() => onSelect(part)} key={part._id}>
                <ListItemText primary={part.partName} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}
