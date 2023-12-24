# Build frontend (into backend/public dir)
echo "Building frontend..."
cd ../frontend
pwd
ls node_modules/.bin/
npm i
npm run build

# Build backend
echo "Building backend..."
cd ../backend
pwd
npm i
