# start from node base image. slim is smaller variant 
FROM node:14-slim

# copy all files from host into current dir 
COPY . .
# sqlite3 library only works on node <= 14.x
RUN npm install

# set default command to run when started
CMD ["./app.js"]

