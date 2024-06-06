import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Box, Button, TextField, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

const Chat = ({ token }) => {
  const [room, setRoom] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState({});
  const socketRef = useRef();
  const user = jwtDecode(token);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001', {
      auth: {
        token
      }
    });

    socketRef.current.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socketRef.current.on('updateRooms', (rooms) => {
      setRooms(rooms);
    });

    socketRef.current.on('error', (error) => {
      alert(error);
    });

    socketRef.current.emit('getRooms');

    return () => {
      socketRef.current.disconnect();
    };
  }, [token]);

  const createRoom = () => {
    if (room !== '') {
      socketRef.current.emit('createRoom', { room });
      setRoom('');
    }
  };

  const joinRoom = (roomName) => {
    if (currentRoom) {
      socketRef.current.emit('leaveChat', { room: currentRoom });
    }
    setCurrentRoom(roomName);
    setMessages([]);
    socketRef.current.emit('joinChat', { room: roomName });
  };

  const leaveRoom = () => {
    if (currentRoom) {
      socketRef.current.emit('leaveChat', { room: currentRoom });
      setCurrentRoom('');
      setMessages([]);
    }
  };

  const closeRoom = (roomName) => {
    socketRef.current.emit('closeRoom', { room: roomName });
    if (roomName === currentRoom) {
      setCurrentRoom('');
      setMessages([]);
    }
  };

  const sendMessage = () => {
    if (message !== '' && currentRoom !== '') {
      socketRef.current.emit('sendMessage', { room: currentRoom, message });
      setMessage('');
    }
  };

  return (
    <Box p={3} maxWidth="600px" mx="auto" mt={5}>
      <Typography variant="h4" gutterBottom>Chat Application</Typography>
      {user.role === 'consultant' && (
        <Box mb={2}>
          <TextField
            label="Create Room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={createRoom} fullWidth>
            Create Room
          </Button>
          <Typography variant="h6" mt={2}>My Rooms</Typography>
          <List>
            {Object.keys(rooms).map((roomName) => (
              rooms[roomName] === user.username && (
                <ListItem button key={roomName} onClick={() => joinRoom(roomName)}>
                  <ListItemText primary={roomName} />
                  <Button variant="contained" color="secondary" onClick={() => closeRoom(roomName)}>
                    Close Room
                  </Button>
                </ListItem>
              )
            ))}
          </List>
        </Box>
      )}
      {user.role === 'client' && (
        <Box mb={2}>
          <Typography variant="h6">Available Rooms</Typography>
          <List>
            {Object.keys(rooms).map((roomName) => (
              <ListItem button key={roomName} onClick={() => joinRoom(roomName)}>
                <ListItemText primary={roomName} secondary={`Consultant: ${rooms[roomName]}`} />
              </ListItem>
            ))}
          </List>
          <Button color="secondary" onClick={leaveRoom} fullWidth>
            Leave Room
          </Button>
        </Box>
      )}
      {currentRoom && (
        <Box mb={2}>
          <TextField
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={sendMessage} fullWidth>
            Send
          </Button>
        </Box>
      )}
      <Paper elevation={3} style={{ maxHeight: '400px', overflow: 'auto', padding: '16px' }}>
        <Typography variant="h5" gutterBottom>Messages</Typography>
        {messages.map((msg, index) => (
          <Box key={index} mb={2}>
            <Typography variant="body1">
              <strong>{msg.username}:</strong> {msg.message}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default Chat;
