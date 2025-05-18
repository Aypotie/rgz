#ifndef HANDLERS_HPP
#define HANDLERS_HPP

#include <string>
#include <vector>

#include "bcrypt/BCrypt.hpp"
#include "../database/database.hpp"
#include "../../lib/jwt-cpp/jwt.h"
#include "../config/config.hpp"

using namespace std;

const string ERROR_INTERNAL = "Внутренняя ошибка";
const string ERROR_USER_NOT_FOUND = "Пользователь не найден";
const string ERROR_INVALID_PASSWORD = "Неправильный пароль";
const string ERROR_INVALID_REQUEST = "Неправильный запрос";

class Handlers
{
private:
    Database &database;
    AppConfig &config;

public:
    Handlers(Database &db, AppConfig &cfg) : database(db), config(cfg) {}

    crow::json::wvalue getStatus()
    {
        vector<Status> statuses;
        try
        {
            statuses = database.getStatus();
        }
        catch (const exception &e)
        {
            cerr << "ERROR: " << e.what() << '\n';
            return crow::json::wvalue{{"error", ERROR_INTERNAL}};
        }

        crow::json::wvalue response;
        for (size_t i = 0; i < statuses.size(); i++)
        {
            response["status"][i] = statuses[i].render();
        }

        return response;
    }

    crow::json::wvalue getType()
    {
        vector<Type> types;
        try
        {
            types = database.getType();
        }
        catch (const std::exception &e)
        {
            cerr << "ERROR: " << e.what() << '\n';
            return crow::json::wvalue{{"error", ERROR_INTERNAL}};
        }

        crow::json::wvalue response;
        for (size_t i = 0; i < types.size(); i++)
        {
            response["type"][i] = types[i].render();
        }

        return response;
    }

    crow::json::wvalue getSector()
    {
        vector<Sector> sectors;
        try
        {
            sectors = database.getSector();
        }
        catch (const exception &e)
        {
            cerr << "ERROR: " << e.what() << '\n';
            return crow::json::wvalue{{"error", ERROR_INTERNAL}};
        }

        crow::json::wvalue response;
        for (size_t i = 0; i < sectors.size(); i++)
        {
            response["sector"][i] = sectors[i].render();
        }

        return response;
    }

    void getIncidents(const crow::request &req, crow::response &res)
    {
        vector<IncidentListItem> incidents;
        int count = 0;
        res.add_header("Content-Type", "application/json");
        auto idParam = req.url_params.get("sector_id");
        auto pageParam = req.url_params.get("page");
        auto limitParam = req.url_params.get("limit");
        int sectorID = 0, page = 1, limit = 0;
        if (idParam)
        {
            sectorID = atoi(idParam);
        }
        if (pageParam)
        {
            page = atoi(pageParam);
        }
        if (limitParam)
        {
            limit = atoi(limitParam);
        }
        try
        {
            auto p = database.getIncidents(sectorID, page, limit);
            incidents = p.first;
            count = p.second;
        }
        catch (const exception &e)
        {
            cerr << "ERROR: " << e.what() << '\n';
            res.code = 500;
            res.write(crow::json::wvalue{{"error", ERROR_INTERNAL}}.dump());
            res.end();
            return;
        }

        crow::json::wvalue response;
        for (size_t i = 0; i < incidents.size(); i++)
        {
            response["incidents"][i] = incidents[i].render();
        }
        if (incidents.empty())
        {
            response["incidents"] = crow::json::wvalue::list();
            response["count"] = 0;
        }
        else
        {
            response["total"] = count;
        }

        res.code = 200;
        res.write(response.dump());
        res.end();
    }

    void login(const crow::request &req, crow::response &res)
    {
        auto body = crow::json::load(req.body);

        if (!body || !body.has("phone") || !body.has("password"))
        {
            res.code = 400;
            res.write(crow::json::wvalue{{"error", ERROR_INVALID_REQUEST}}.dump());
            res.end();
            return;
        }

        string phone = body["phone"].s();
        string password = body["password"].s();

        // Получаем пользователя из БД
        Securityman *user;
        try
        {
            user = database.getSecuritymanByPhone(phone);
        }
        catch (const exception &e)
        {
            res.code = 400;
            res.write(crow::json::wvalue{{"error", ERROR_INTERNAL}}.dump());
            res.end();
            return;
        }
        if (user == nullptr)
        {
            res.code = 404;
            res.write(crow::json::wvalue{{"error", ERROR_USER_NOT_FOUND}}.dump());
            res.end();
            return;
        }

        if (!BCrypt::validatePassword(password.c_str(), user->password))
        {
            res.code = 401;
            res.write(crow::json::wvalue{{"error", ERROR_INVALID_PASSWORD}}.dump());
            res.end();
            return;
        }

        // Генерация JWT
        string token = jwt::create()
                           .set_type("JWT")
                           .set_payload_claim("id", jwt::claim(to_string(user->id)))
                           .set_payload_claim("phone", jwt::claim(user->phone))
                           .set_payload_claim("name", jwt::claim(user->name))
                           .set_payload_claim("surname", jwt::claim(user->surname))
                           .set_payload_claim("lastname", jwt::claim(user->last_name))
                           .set_expires_at(std::chrono::system_clock::now() + chrono::hours(config.jwtTTLHours))
                           .sign(jwt::algorithm::hs256{config.jwtSecret});
        delete user;
        res.code = 200;
        res.add_header("Set-Cookie", "token=" + token + "; HttpOnly; Path=/; Max-Age=" + to_string(config.jwtTTLHours * 3600));
        res.end();
    }

    void logout(const crow::request &req, crow::response &res)
    {
        res.code = 200;
        res.add_header("Set-Cookie", string("token=") + "; Path=/; Max-Age=-1");
        res.end();
    }

    void getUser(const AuthMiddleware::context &ctx, crow::response &res)
    {
        if (!ctx.isAuthenticated || ctx.user == nullptr)
        {
            res.code = 401;
            res.write(crow::json::wvalue{{"error", "Пользователь не авторизован"}}.dump());
            res.end();
            return;
        }

        Securityman *user = ctx.user;
        crow::json::wvalue result = {
            {"id", user->id},
            {"phone", user->phone},
            {"name", user->name},
            {"surname", user->surname},
            {"lastname", user->last_name}};

        res.code = 200;
        res.write(result.dump());
        res.end();
        ;
    }

    void createIncident(const AuthMiddleware::context &ctx, const crow::request &req, crow::response &res)
    {
        if (!ctx.isAuthenticated || ctx.user == nullptr)
        {
            res.code = 401;
            res.write(crow::json::wvalue{{"error", "Пользователь не авторизован"}}.dump());
            res.end();
            return;
        }

        Securityman *user = ctx.user;
        auto body = crow::json::load(req.body);

        if (!body || !body.has("incident_time") || !body.has("description") ||
            !body.has("status_id") || !body.has("type_incident_id") || !body.has("sector") || !body.has("critical_level_id"))
        {
            res.code = 400;
            res.write(crow::json::wvalue{{"error", "Неверный формат запроса"}}.dump());
            res.end();
            return;
        }

        try
        {
            int incidentId = database.createIncident(
                body["incident_time"].s(),
                body["description"].s(),
                body["status_id"].i(),
                user->id,
                body["type_incident_id"].i(),
                body["sector"].s(),
                body["critical_level_id"].i());

            res.code = 201;
            res.write(crow::json::wvalue{{"id", incidentId}}.dump());
            res.end();
        }
        catch (const exception &e)
        {
            cerr << "DB ERROR: " << e.what() << endl;
            res.code = 500;
            res.write(crow::json::wvalue{{"error", ERROR_INTERNAL}}.dump());
            res.end();
        }
    }
    void deleteIncident(const AuthMiddleware::context &ctx, const crow::request &req, crow::response &res)
    {
        auto idParam = req.url_params.get("id");
        if (!idParam)
        {
            res.code = 400;
            res.write(crow::json::wvalue{{"error", "Отсутствует параметр id"}}.dump());
            res.end();
            return;
        }

        int id = atoi(idParam);

        try
        {
            database.deleteIncident(id);
            res.code = 200;
            res.write(crow::json::wvalue{{"message", "Инцидент удалён"}}.dump());
            res.end();
        }
        catch (const std::exception &e)
        {
            cerr << "DB ERROR: " << e.what() << endl;
            res.code = 500;
            res.write(crow::json::wvalue{{"error", ERROR_INTERNAL}}.dump());
            res.end();
        }
    }

    crow::json::wvalue getIncident(int incidentId)
    {
        try
        {
            Incident incident = database.getIncident(incidentId);

            return incident.render();
        }
        catch (const exception &e)
        {
            cerr << "ERROR: " << e.what() << '\n';
            return crow::json::wvalue{{"error", ERROR_INTERNAL}};
        }
    }
};
#endif