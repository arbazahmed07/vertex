import * as React from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import SendIcon from '@mui/icons-material/Send';
import Fab from '@mui/material/Fab';
import { deepOrange, blue, green, purple, red } from '@mui/material/colors';
import { Typography, CircularProgress, Badge, Box } from "@mui/material";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const gridBorder = {
    borderRight: '1px solid #e0e0e0'
};

const gridMsg = {
    height: '70vh',
    overflowY: 'auto'
};

// Function to generate consistent color based on name
const stringToColor = (string) => {
    let hash = 0;
    if (!string) return deepOrange[500];
    
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [deepOrange[500], blue[500], green[500], purple[500], red[500]];
    return colors[Math.abs(hash) % colors.length];
};

// Function to get initials from name
const getInitials = (name) => {
    if (!name) return "??";
    return name.split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

function Chat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Set current user from localStorage
        const email = localStorage.getItem("user");
        const name = localStorage.getItem("name");
        if (email) {
            setCurrentUser({
                email,
                name: name || email
            });
        }

        // Fetch users from the server
        const fetchUsers = async () => {
            try {
                const link = process.env.REACT_APP_API_URL || "http://localhost:4000";
                const response = await axios.get(`${link}/users/all`);
                if (response.data.success) {
                    // Filter out current user
                    const filteredUsers = response.data.users.filter(user => user.email !== email);
                    setUsers(filteredUsers);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

        // Connect to socket server
        const link = process.env.REACT_APP_API_URL || "http://localhost:4000";
        const newSocket = io(link);
        setSocket(newSocket);

        // Set up event listeners
        newSocket.on("receive_message", (data) => {
            if (data.senderId === selectedUser?.email || data.receiverId === selectedUser?.email) {
                setMessages(prev => [...prev, {
                    text: data.message,
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    sent: data.senderId === email
                }]);
            }
        });

        // Clean up on unmount
        return () => {
            newSocket.disconnect();
        };
    }, [selectedUser]);

    useEffect(() => {
        // Scroll to bottom when messages change
        scrollToBottom();
    }, [messages]);

    const fetchChatHistory = async (recipient) => {
        if (!currentUser || !recipient) return;
        
        try {
            const link = process.env.REACT_APP_API_URL || "http://localhost:4000";
            // Get chat ID (sort emails to make it consistent)
            const participants = [currentUser.email, recipient.email].sort();
            const chatId = participants.join('_');
            
            const response = await axios.get(`${link}/messages/history/${chatId}`);
            
            if (response.data.success) {
                // Format messages for display
                const formattedMessages = response.data.messages.map(msg => ({
                    text: msg.message,
                    time: new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    sent: msg.senderId === currentUser.email
                }));
                
                setMessages(formattedMessages);
            }
        } catch (error) {
            console.error("Error fetching chat history:", error);
            // Set empty messages array if there's an error
            setMessages([]);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        fetchChatHistory(user);
    };

    const handleSendMessage = async () => {
        if (message.trim() === "" || !selectedUser || !currentUser) return;

        const participants = [currentUser.email, selectedUser.email].sort();
        const chatId = participants.join('_');
        const timestamp = new Date();
        
        // Create message object
        const messageData = {
            chatId,
            senderId: currentUser.email,
            receiverId: selectedUser.email,
            message: message,
            timestamp
        };

        // Save message to database
        try {
            const link = process.env.REACT_APP_API_URL || "http://localhost:4000";
            await axios.post(`${link}/messages/send`, messageData);
        } catch (error) {
            console.error("Error saving message:", error);
        }

        // Send message via socket
        if (socket) {
            socket.emit("send_message", messageData);
        }

        // Add message to local state
        const newMessage = {
            text: message,
            time: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            sent: true
        };
        setMessages([...messages, newMessage]);
        
        // Clear input
        setMessage("");
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user => 
        user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ margin: '20px' }}>
            <Grid container component={Card}>
                <Grid item xs={3} sx={gridBorder}>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <Avatar 
                                    sx={{ bgcolor: stringToColor(currentUser?.name || "") }} 
                                    variant="rounded"
                                >
                                    {getInitials(currentUser?.name)}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText 
                                primary={currentUser?.name || "Loading..."}
                                secondary={currentUser?.email} 
                            />
                        </ListItem>
                    </List>
                    <Divider />
                    <Grid item xs={12} style={{ padding: '10px' }}>
                        <TextField 
                            label="Search Users" 
                            variant="outlined" 
                            fullWidth 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Divider />
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                            <CircularProgress />
                        </div>
                    ) : (
                        <List sx={{ overflow: 'auto', maxHeight: '60vh' }}>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <ListItem 
                                        button 
                                        key={user.email}
                                        selected={selectedUser?.email === user.email}
                                        onClick={() => handleSelectUser(user)}
                                    >
                                        <ListItemIcon>
                                            <Avatar 
                                                sx={{ bgcolor: stringToColor(user.name) }} 
                                                variant="rounded"
                                            >
                                                {getInitials(user.name)}
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={user.name} 
                                            secondary={user.email}
                                        />
                                        {user.online && (
                                            <Badge color="success" variant="dot" />
                                        )}
                                    </ListItem>
                                ))
                            ) : (
                                <Typography sx={{ p: 2, textAlign: 'center' }}>
                                    No users found
                                </Typography>
                            )}
                        </List>
                    )}
                </Grid>
                <Grid item xs={9}>
                    {!selectedUser ? (
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: '100%', 
                            color: 'grey' 
                        }}>
                            <Typography variant="h6">
                                Select a user to start chatting
                            </Typography>
                        </div>
                    ) : (
                        <>
                            <Box sx={{ 
                                p: 2, 
                                bgcolor: '#f5f5f5', 
                                borderBottom: '1px solid #e0e0e0',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Avatar 
                                    sx={{ bgcolor: stringToColor(selectedUser.name), mr: 2 }} 
                                    variant="rounded"
                                >
                                    {getInitials(selectedUser.name)}
                                </Avatar>
                                <Typography variant="h6">
                                    {selectedUser.name}
                                </Typography>
                            </Box>
                            <List sx={gridMsg}>
                                {messages.length > 0 ? (
                                    messages.map((msg, index) => (
                                        <ListItem key={index}>
                                            <Grid item xs={12} align={msg.sent ? "right" : "left"}>
                                                <Card sx={{ 
                                                    maxWidth: 600, 
                                                    p: 1, 
                                                    display: 'inline-block',
                                                    bgcolor: msg.sent ? '#e3f2fd' : '#f5f5f5' 
                                                }}>
                                                    <Typography>{msg.text}</Typography>
                                                    <Typography sx={{ fontSize: 13, mt: 0.5, textAlign: 'right' }}>
                                                        {msg.time}
                                                    </Typography>
                                                </Card>
                                            </Grid>
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography sx={{ p: 2, textAlign: 'center', color: 'grey' }}>
                                        No messages yet. Start the conversation!
                                    </Typography>
                                )}
                                <div ref={messagesEndRef} />
                            </List>
                            <Divider />
                            <Grid container style={{ padding: '15px' }}>
                                <Grid item xs={11}>
                                    <TextField 
                                        label="Message" 
                                        fullWidth 
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                </Grid>
                                <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <Fab 
                                        color="primary" 
                                        size="medium"
                                        aria-label="send" 
                                        onClick={handleSendMessage}
                                        disabled={!message.trim()}
                                    >
                                        <SendIcon />
                                    </Fab>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Grid>
        </div>
    );
}

export default Chat;