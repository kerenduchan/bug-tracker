# Build frontend (into backend/public dir)
cd ../frontend
npm i
npm run build

# Build backend
cd ../backend
cp -r data-empty data
npm i
