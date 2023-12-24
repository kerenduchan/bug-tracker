# Build frontend (into backend/public dir)
echo "Building frontend..."
cd ../frontend
pwd
npm i
npm run build

# Build backend
echo "Building backend..."
cd ../backend
pwd
npm i
