# ---------- Development image (for Prisma generate) ----------
    FROM node:22.13.1-alpine AS build

    WORKDIR /usr/src/app
    
    # Install dependencies (both prod + dev)
    COPY package*.json ./
    RUN npm install
    
    # Copy everything and generate Prisma client
    COPY . ./
    RUN npx prisma generate
    
    # ---------- Production image ----------
    FROM node:22.13.1-alpine
    
    WORKDIR /usr/src/app
    
    # Install only production dependencies
    COPY package*.json ./
    RUN npm ci --omit=dev
    
    # Copy built Prisma client only (from build stage)
    COPY --from=build /usr/src/app/node_modules/@prisma /usr/src/app/node_modules/@prisma
    COPY --from=build /usr/src/app/node_modules/.prisma /usr/src/app/node_modules/.prisma
    COPY --from=build /usr/src/app/prisma /usr/src/app/prisma
    COPY . .
    
    EXPOSE 5000
    CMD ["node", "app.js"]
    