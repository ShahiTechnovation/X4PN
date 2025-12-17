# X4PN-VPN Project Run Instructions

## Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn package manager

## Setup and Installation

1. Clone or download the X4PN-VPN repository
2. Navigate to the project root directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project

### Development Mode
To run the project in development mode:
```bash
npm run dev
```

This will:
- Start the Express.js backend server on port 5000
- Launch the Vite development server for the React frontend
- Enable hot reloading for both frontend and backend changes

### Production Build
To build the project for production:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

## Accessing the Application

Once the development server is running:
- Open your browser and navigate to `http://localhost:5000`
- The frontend React application will be served
- The backend API is also available at the same port

## API Endpoints

The backend provides the following API endpoints:
- `GET /api/nodes` - Get all active VPN nodes
- `GET /api/nodes/:id` - Get a specific node by ID
- `POST /api/nodes/register` - Register a new VPN node
- `GET /api/users/:address` - Get or create a user by wallet address
- `POST /api/deposits` - Process USDC deposits
- `POST /api/withdrawals` - Process withdrawals
- `POST /api/sessions/start` - Start a VPN session
- `POST /api/sessions/settle` - Settle an active session
- `POST /api/sessions/end` - End a VPN session
- `GET /api/sessions/:address` - Get session history for a user
- `GET /api/sessions/active/:address` - Get active session for a user
- `GET /api/transactions/:userId` - Get transaction history for a user
- `GET /api/stats` - Get network statistics

## Troubleshooting

### Common Issues

1. **Port Conflicts**: If port 5000 is already in use, you can specify a different port:
   ```bash
   PORT=3000 npm run dev
   ```

2. **Import Resolution Errors**: If you encounter issues with contract artifact imports:
   - Ensure the contract artifacts are in the correct location
   - Check the import paths in `client/src/lib/contracts.ts`
   - The artifacts should be accessible from the client directory

3. **Database Connection**: The project uses an in-memory storage system by default for development. For production, you would need to configure a PostgreSQL database.

### File Structure Issues

If you encounter file resolution issues with Vite:
1. Ensure the `vite.config.ts` file has proper fs.allow configurations
2. Copy contract artifacts to `client/src/contracts/` if needed
3. Update import paths accordingly

## Project Structure

```
X4PN-VPN/
├── client/                 # React frontend
│   ├── src/                # Source files
│   │   ├── components/     # React components
│   │   ├── lib/            # Utility libraries
│   │   ├── pages/          # Page components
│   │   └── ...             # Other frontend files
├── contracts/              # Smart contracts
│   ├── artifacts/          # Compiled contract artifacts
│   └── ...                 # Contract source files
├── server/                 # Backend server
│   ├── index.ts            # Entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage
│   └── ...                 # Other server files
├── shared/                 # Shared code between frontend and backend
└── ...                     # Configuration and other files
```

## Development Workflow

1. Make changes to the code
2. The development server will automatically reload
3. View changes in your browser at `http://localhost:5000`
4. For backend changes, the server will restart automatically
5. For frontend changes, Vite will hot-reload the UI

## Stopping the Server

To stop the development server, press `Ctrl+C` in the terminal where it's running.