# Website-Blog

[![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![React](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![GitHub issues](https://img.shields.io/github/issues/Jozefwl/website-blog?style=for-the-badge)](https://github.com/Jozefwl/website-blog/issues)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!


This project aims to create a fully customizable personal website with a blog, built with modern web technologies. The goal is to have full control over the design and functionality, without the limitations of platforms like WordPress.

## Features

- **Frontend:** Built using React for a sleek, modern, and minimalistic user interface.
- **Backend:** Powered by Express.js, with a RESTful API for managing blog content.
- **Authentication:** Secure login system using JWT (JSON Web Tokens).
- **Database:** MongoDB for storing blog posts, user data, and other content.
- **Content Management:** Easy-to-use interface for creating, editing, and managing blog posts.
- **Customizable Layout:** Includes tiling components to allow content to be moved around, similar to MS Word/WordPress block editing.

## Project Structure

- **Frontend:** 
  - React components will be used to create a responsive, minimalistic UI.
  - State management with React Context or Redux for handling global state.
  - React Router for client-side routing.
  
- **Backend:**
  - Express.js will handle API requests, including CRUD operations for blog posts.
  - JWT tokens will be used for authentication, securing API endpoints.
  - MongoDB will serve as the database, accessed via Mongoose ODM.
  
- **Authentication:**
  - User login will be handled with JWT, ensuring secure access to administrative features.
  
- **Content Management:**
  - The blog will feature an editor interface for adding and modifying posts.
  - Drag-and-drop or tiling functionality for organizing content blocks.

## Getting Started

### Prerequisites

- **Node.js & npm:** Ensure you have Node.js and npm installed.
- **MongoDB:** A running MongoDB instance is required.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jozefwl/website-blog.git
   ```
2. **Install dependencies:**
   ```bash
   cd website-blog
   npm install
   ```
3. **Set up environment variables: Create a .env file in the root of your project with the following:**
    ```bash
    PORT=5000
    MONGODB_URI=your-mongodb-connection-string
    JWT_SECRET=your-jwt-secret
    ```
4. **Run the backend and frontend in multiplexer of choice:**
    ```bash
    screen -S backend
    npm run backend
    screen -S frontend
    npm run frontend
    ```
    
### Usage

- **Frontend:** Access the frontend by navigating to `http://localhost:3000` in your browser.
- **Backend:** The backend API can be accessed at `http://localhost:5000/`.

### API Endpoints

- **/auth/login:** POST request for user authentication.
- **/blogposts:** GET request to fetch all blog posts.
- **/blogposts/:id:** GET, PUT, DELETE requests for managing individual blog posts.
- **/blogposts/add:** POST request to create a new blog post.

## Roadmap

- **Frontend:**
  - Implement drag-and-drop or tiling UI for content management.
  - Add more customization options for blog post formatting.
  - Implement mobile-responsive design.

- **Backend:**
  - Implement additional security features (definitely password hashing).
  - Add support for media uploads (images, videos).

- **Testing:**
  - Set up unit tests for frontend components and backend routes.

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue for any bug fixes, enhancements, or ideas.

## License

This project is licensed under the MIT License.
