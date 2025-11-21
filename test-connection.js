require('dotenv').config({ path: require('path').join(__dirname, 'backend', '.env') });

console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***SET***' : 'NOT SET');
console.log('EMAIL_USER:', process.env.EMAIL_USER);

const mongoose = require('mongoose');

console.log('\nAttempting MongoDB connection...');
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        console.error('Full error:', err);
        process.exit(1);
    });
