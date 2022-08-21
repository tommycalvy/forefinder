# stage build
FROM node:18.5.0-alpine3.15 AS builder

WORKDIR /app

# copy everything to the container
COPY . .

# clean install all dependencies
RUN npm ci

# remove potential security issues
RUN npm audit fix
    
# build SvelteKit app
RUN npm run build


# stage run
FROM node:18.5.0-alpine3.15

WORKDIR /app

# copy dependency list
COPY --from=builder /app/package*.json ./

# clean install dependencies, no devDependencies, no prepare script
RUN npm ci --production --ignore-scripts

# remove potential security issues
RUN npm audit fix

# copy built SvelteKit app to /app
COPY --from=builder /app/build ./

EXPOSE 3000
CMD ["node", "./index.js"]