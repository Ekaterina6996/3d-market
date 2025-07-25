FROM minio/mc:latest

COPY setup-minio.sh /setup-minio.sh
RUN chmod +x /setup-minio.sh

ENTRYPOINT ["/setup-minio.sh"]