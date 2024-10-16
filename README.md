# URL Redirector

This project is a simple URL redirection tool built with React and Node.js. It allows users to create and manage custom URL redirects.

## Features

- Create custom URL redirects
- View all existing redirects
- Delete redirects
- External API for programmatic redirect creation

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/elstruck/redirect.git
   cd url-redirector
   ```

2. Install dependencies for both frontend and backend:
   ```
   npm install
   cd src
   npm install
   cd ..
   ```

3. Start the backend server:
   ```
   node src/redirector.js
   ```

4. In a new terminal, start the React frontend:
   ```
   npm start
   ```

5. Open the app in your browser. You can change the ports, but I think mine are set to 3001 and 3002.

## Usage

### Creating a Redirect

1. Enter the local URL (the short URL you want to use) in the "URL local" field.
2. Enter the destination URL in the "URL redirect" field.
3. Click "Save" to create the redirect.

### Viewing Redirects

All existing redirects are displayed in a table below the input form.

### Deleting a Redirect

Click the "Delete" button next to any redirect in the table to remove it.

### Using a Redirect

To use a redirect, navigate to:
