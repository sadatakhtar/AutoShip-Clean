# ============================
# BUILD STAGE
# ============================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY AutoShip.csproj .
RUN dotnet restore

# Copy the rest of the source code
COPY . .
RUN dotnet publish -c Release -o /app/publish


# ============================
# RUNTIME STAGE
# ============================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Install EF Tools inside the runtime container
RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

# Copy published output
COPY --from=build /app/publish .

# Expose backend port
EXPOSE 5000
ENV ASPNETCORE_URLS=http://0.0.0.0:5000

# Run migrations automatically, then start API
ENTRYPOINT ["bash", "-c", "dotnet ef database update && dotnet AutoShip.dll"]
