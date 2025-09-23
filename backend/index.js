const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./db');
// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const socialRoutes = require('./routes/social');

const adminRoutes = require('./routes/admin');

const notificationRoutes = require('./routes/notification');
const postRoutes = require('./routes/post');


const path = require('path');

const http = require('http');
const { Server } = require('socket.io');
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Test DB connection
db.getConnection()
	.then(() => console.log('Connected to MySQL database'))
	.catch((err) => console.error('DB connection error:', err));

app.get('/', (req, res) => {
	res.send('API is running');
});


const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

io.on('connection', (socket) => {
	console.log('A user connected:', socket.id);
	socket.on('disconnect', () => {
		console.log('User disconnected:', socket.id);
	});
});

// Make io accessible in routes/controllers if needed
app.set('io', io);

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
