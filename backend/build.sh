# Build frontend (into backend/public dir)
cd ../frontend
npm i
npm run build

# Build backend
cd ../backend

if ! test -d data
then
    cp -r data-empty data
fi

npm i
