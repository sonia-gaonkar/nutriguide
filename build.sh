#!/bin/bash

check_errcode() {
    status=$?

    if [ $status -ne 0 ]; then
        echo "${1}"
        exit $status
    fi
}

echo "Checking for missing dependencies before build..."

# Check if node_modules exists, if not throw an error
if [ ! -d "./node_modules" ] || [ ! -d ".app/frontend/node_modules" ]; then
    echo "node_modules are missing! running install script..."
    #npm run install:all
    npm install
    echo "Installed all missing dependencies! starting installation..."
else
    echo "All dependencies are installed! Ready to run build!"
fi


# This script compiles typescript and Angular 7 application and puts them into a single NodeJS project
ENV=${NODE_ENV:-production}
echo -e "\n-- Started build script for Angular & NodeJS (environment $ENV) --"
echo "Removing dist directory..."
rm -rf /app/frontend/dist

#echo "Compiling typescript..."
#./node_modules/.bin/tsc -p ./tsconfig.prod.json
#check_errcode "Failed to compile typescript! aborting script!"

#echo "Copying configuration files..."
#cp -Rf src/config dist/src/config
#check_errcode "Failed to copy configuration files! aborting script!"

echo "Starting to configure Angular app..."
pushd app
pushd frontend


# Check if node_modules exists, if not throw an error
if [ ! -d "./node_modules" ]; then
    echo "node_modules are missing! running install script..."
    npm install
    echo "Installed all missing dependencies! starting installation..."
else
    echo "All dependencies are installed! Ready to run build!"
fi

echo "Building Angular app for $ENV..."
./node_modules/.bin/ng build --configuration $ENV
check_errcode "Failed to build angular! stopping script!"

# Go back to the current directory
popd
popd

#if [ -n "$DB_URI" ]; then
  #echo "DB_URI has the value: $DB_URI"
#else
  #check_errcode "Error: DB_URI is set to the empty string....."
#fi

webpack


echo "-- Finished building Angular & NodeJS, check dist directory --"
