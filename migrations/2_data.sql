INSERT INTO securityman (surname, name, last_name, phone, password)
VALUES ('Потапова','Айсмик','Васильевна','89133425555','$2a$12$Gwg7cmUZPspmnisDbW9yBeBYjTwEU207IkHP5Ym5CvVZbaqzJJw9e'), -- password
('Постманов','Постман','Постманович','89130001234','$2y$10$TdkqbdFv5i4fPdgMn9H8sO45BTArTNXlf8DMVX7fO6koaKnf2zCNG'); -- password123

INSERT INTO sector (name)
VALUES ('A1'), ('A2');

INSERT INTO status (name)
VALUES ('Открыто'), ('Закрыто');

INSERT INTO type_incident (name)
VALUES ('Драка'), ('Пожар'),
('Кража'), ('Потеря'),
('Угроза'), ('Проблемы с охраной'),
('Другое');

INSERT INTO critical_level (name)
VALUES ('Низкий'), ('Средний'), ('Высокий'), ('Очень высокий'), ('Критический');

INSERT INTO incident (incident_time, description, status_id, securityman_id, type_incident_id, sector_id, critical_level_id) 
VALUES ('2025-05-17 10:30:00', 'Конфликт между посетителями у входа A1', 1, 1, 1, 1, 3),
('2025-05-17 12:33:00', 'Конфликт между посетителями у входа A1', 1, 1, 1, 2, 3);