# Stage 1: Build the application
FROM node:18-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENV NODE_ENV=development

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and lock to the container
COPY package.json pnpm-lock.yaml ./

# Install the project dependencies using Yarn
RUN pnpm install --frozen-lockfile

# Copy the rest of the project files to the container
COPY . .

# Build the NestJS application
RUN pnpm prisma generate
RUN pnpm build

# Stage 2: Create a lightweight container with the built application
FROM node:18-slim AS production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy the built application from the previous stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.pnpm/@prisma+client@6.14.0_prisma@6.14.0_typescript@5.9.2__typescript@5.9.2/node_modules/@prisma/client ./node_modules/.pnpm/@prisma+client@6.14.0_prisma@6.14.0_typescript@5.9.2__typescript@5.9.2/node_modules/@prisma/client
COPY --from=build /app/assets ./assets

# Install only production dependencies
RUN pnpm install --production --frozen-lockfile
RUN pnpm install pm2 -g

EXPOSE 3001

# Command to run the application
CMD [ "npm", "run", "start:migrate:prod" ]
