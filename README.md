# API - Version 0.0.1

# Welcome Homepage 
http://localhost:3013

# Run:
$ docker-compose up -d --build

# Build:
- docker build -t diegocasagrande/app-pharmacy:0.0.1 -t diegocasagrande/app-pharmacy:latest .
- docker push diegocasagrande/app-pharmacy:0.0.1
- docker push diegocasagrande/app-pharmacy:latest

# Metrics
http://localhost:3013/metrics/