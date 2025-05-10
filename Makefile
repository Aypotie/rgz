docker-up:
	@docker compose up --build -d

docker-down:
	@docker compose down

docker-delete:
	@docker compose down --volumes --remove-orphans
