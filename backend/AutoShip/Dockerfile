# --- Build Stage ---
# FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# WORKDIR /app

# # Copy csproj and restore dependencies
# COPY *.csproj ./
# RUN dotnet restore

# # Copy the rest of the files
# COPY . ./

# # Publish app for production
# RUN dotnet publish -c Release -o /app/publish

# # --- Runtime Stage ---
# FROM mcr.microsoft.com/dotnet/aspnet:9.0

# WORKDIR /app
# COPY --from=build /app/publish ./

# # Expose the port your app runs on
# EXPOSE 5000

# ENTRYPOINT ["dotnet", "AutoShip.dll"]

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY AutoShip.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 5000
ENV ASPNETCORE_URLS=http://0.0.0.0:5000

ENTRYPOINT ["dotnet", "AutoShip.dll"]

