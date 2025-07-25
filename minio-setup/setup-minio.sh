#!/bin/sh

# Wait for MinIO to be ready
until (/usr/bin/mc config host add minio http://minio:9000 minioadmin minioadmin) do echo 'Waiting for MinIO...' && sleep 1; done

# Create bucket
/usr/bin/mc mb minio/3dprints

# Set access policy
/usr/bin/mc policy set public minio/3dprints

echo "MinIO setup complete"