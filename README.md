# 3D Printing Marketplace - School Project MVP

## Технологии
- Frontend: React + TypeScript
- Backend: Node.js + Express
- База данных: PostgreSQL
- Хранение файлов: MinIO
- Микросервисы:
  - Auth Service (аутентификация)
  - Core Service (проекты и заказы)
  - Chat Service (чат в реальном времени)

## Установка на Arch Linux

1. Установите Docker и Docker Compose:
sudo pacman -S docker docker-compose
sudo systemctl enable --now docker

2. Склонируйте репозиторий:
git clone https://github.com/your-username/3d-print-mvp.git
cd 3d-print-mvp

3. Создайте .env файл (на основе .env.example):
cp .env.example .env

4. Запустите проект:
docker-compose up --build -d

5. Откройте в браузере:
xdg-open http://localhost:3000