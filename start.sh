#!/bin/bash
set -e  # Stop on first error
set -x  # Print each command before executing

echo "Starting ASP.NET Core backend..."
dotnet run --project backend/AutoShip/AutoShip.csproj &

echo "Starting React frontend..."
cd frontend/WebClient
npm run dev