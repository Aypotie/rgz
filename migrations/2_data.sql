INSERT INTO securityman (surname, name, last_name, phone, password)
VALUES ('Потапова','Айсмик','Васильевна','89133425555','$2a$12$Gwg7cmUZPspmnisDbW9yBeBYjTwEU207IkHP5Ym5CvVZbaqzJJw9e');

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