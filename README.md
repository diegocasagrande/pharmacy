# HOBB API - Version 0.0.1

# Welcome Homepage 
http://localhost:3443

# Run:
$ docker-compose up -d --build

# Build:
- docker build -t diegocasagrande/app-test:0.0.1 -t diegocasagrande/app-test:latest .
- docker push diegocasagrande/app-test:0.0.1
- docker push diegocasagrande/app-test:latest

# HOBB Metrics
http://localhost:3443/metrics/