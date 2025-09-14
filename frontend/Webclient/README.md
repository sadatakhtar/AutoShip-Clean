# 🚗 AutoShip

AutoShip is a full-stack web application designed to streamline vehicle data management and shipping logistics. 
It combines the power of an ASP.NET Core Web API backend with a fast, modern React Vite frontend.

---

## 🧰 Tech Stack

- **Backend:** ASP.NET Core Web API  
- **Frontend:** React (Vite)  
- **Database:** Microsoft SQL Server (MSSQL)  
- **Startup Script:** Bash (`start.sh`)

---

## ⚙️ Getting Started

To run AutoShip locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/AutoShip.git
   cd AutoShip

2. **Run the startup script**
   ./start.sh

   This will:
   • Start the backend server at http://localhost:5065
   • Launch the frontend app at http://localhost:5173

   Note: Ensure you have the required dependencies installed:
 	• .NET SDK
 	• Node.js & npm
 	• Microsoft SQL Server (locally or via cloud)

3. **API Overview**

GET http://localhost:5065/api/car Returns a list of cars in JSON format.

• Alternatively, you can run the backend project and access Scalar OpenApi at (https://localhost:7120/Scalar/v1)

4. **Project Structure**

AutoShip/
├── backend/         # ASP.NET Core Web API
├── frontend/        # React Vite app
├── start.sh         # Startup script
└── README.md

5. **Database Configuration**

AutoShip uses Microsoft SQL Server for data storage. To configure the database:
• 	Update the connection string in  under the  directory.
• 	Ensure the database is running and accessible before starting the backend.
• 	Use Entity Framework Core migrations (if applicable) to initialize the schema.

**License**

This project is licensed under the MIT License.
