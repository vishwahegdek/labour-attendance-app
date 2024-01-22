# Labor Attendance and Wages Management System

This project is aimed at maintaining the attendance of daily laborers and managing their wages . The system provides a convenient way to monitor daily presence and calculate wages based on working hours.

## Technologies Used

- Node.js
- Express
- MongoDB
- EJS Templating

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/labor-attendance-management.git
   cd labor-attendance-management
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the MongoDB connection in `config.js`:

   ```javascript
   module.exports = {
     mongoURI: "your-mongodb-connection-string",
   };
   ```

4. Run the application:

   ```bash
   node index.js
   ```

## Usage

- Access the application at `http://localhost:3000` in your web browser.
- Use the system to record labor attendance and manage their wages.

## Features

- Attendance Tracking: Record daily labor presence.
- Wages Calculation: Automatically calculate wages based on working hours.
- User-Friendly Interface: Simple and intuitive design for easy usage.
