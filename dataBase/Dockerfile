FROM mysql:latest

# Set environment variables for MySQL
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=trivio

# Copy your trivio.sql file into the container
COPY ./trivio.sql /docker-entrypoint-initdb.d/

# Expose MySQL port
EXPOSE 3306