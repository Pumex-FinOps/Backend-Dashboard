const bcrypt = require('bcrypt');
const User = require('../model/userSchema');

const initializeAdmin = async () => {
    try {
        const adminUsername = 'admin';
        const adminPassword = 'admin';
        
        const existingAdmin = await User.findOne({ userName: adminUsername });
        if (existingAdmin) return;

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const adminUser = new User({
            userName: adminUsername,
            password: hashedPassword,
            name: 'Admin',
            email: 'admin@mail.com',
            accessLevel: ['Admin Level'],
            userType: 'Full time'
        });

        await adminUser.save();
        console.log('Default admin  created successfully.');
    } catch (error) {
        console.error('Error initializing admin user:', error.message);
    }
};

module.exports = { initializeAdmin };
