# Build frontend (into backend/public dir)
echo "Building frontend..."
cd ../frontend
pwd
npm install --legacy-peer-deps
echo "ls node_modules/"
ls node_modules/
echo "ls node_modules/.bin"
ls node_modules/.bin
npm run build

# Build backend
echo "Building backend..."
cd ../backend
pwd
npm install
