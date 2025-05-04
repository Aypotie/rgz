docker-up:
	@docker compose up --build -d

docker-down:
	@docker compose down

build:
	@g++ main.cpp -lpqxx -lpq -lpthread -o main