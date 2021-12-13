# start from node base image. slim is smaller variant 
FROM node:14-slim

# copy just package*.json files so npm install is cached 
COPY package.json package-lock.json .
# sqlite3 library only works on node <= 14.x
RUN npm install
# copy remaining files from host into current dir
COPY . .

# set default command to run when started
CMD ["./app.js"]

