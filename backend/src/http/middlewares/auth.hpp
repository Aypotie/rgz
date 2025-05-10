#ifndef AUTH_MIDDLEWARE_HPP
#define AUTH_MIDDLEWARE_HPP

#include "../../../lib/crow_all.h"
#include "../../config/config.hpp"
#include "../../../lib/jwt-cpp/jwt.h"
#include "../../models/models.hpp"

using namespace std;

AppConfig *globalAppConfig = nullptr;

struct AuthMiddleware : crow::ILocalMiddleware
{
    struct context
    {
        Securityman *user;
        bool isAuthenticated = false;
    };

    void before_handle(crow::request &req, crow::response &res, context &ctx)
    {
        auto cookieHeader = req.get_header_value("Cookie");
        if (cookieHeader.empty())
        {
            res.code = 401;
            res.write(crow::json::wvalue{{"error", "Токен отсутствует"}}.dump());
            res.end();
            return;
        }

        // Поиск токена в Cookie
        string tokenPrefix = "token=";
        size_t pos = cookieHeader.find(tokenPrefix);
        if (pos == string::npos)
        {
            res.code = 401;
            res.write(crow::json::wvalue{{"error", "Токен пустой"}}.dump());
            res.end();
            return;
        }

        size_t start = pos + tokenPrefix.length();
        size_t end = cookieHeader.find(";", start);
        string token = cookieHeader.substr(start, end - start);

        try
        {
            auto decoded = jwt::decode(token);
            auto verifier = jwt::verify()
                                .allow_algorithm(jwt::algorithm::hs256{globalAppConfig->jwtSecret});

            verifier.verify(decoded);

            // TODO: добавить проверку на просрочку токена

            Securityman *user = new Securityman{};
            user->id = stoi(decoded.get_payload_claim("id").as_string());
            user->phone = decoded.get_payload_claim("phone").as_string();
            user->name = decoded.get_payload_claim("name").as_string();
            user->surname = decoded.get_payload_claim("surname").as_string();
            user->last_name = decoded.get_payload_claim("lastname").as_string();
            ctx.user = user;
            ctx.isAuthenticated = true;
        }
        catch (const exception &e)
        {
            res.code = 401;
            res.write(crow::json::wvalue{{"error", "Неавторизованный запрос"}}.dump());
            res.end();
            return;
        }
    }

    void after_handle(crow::request &req, crow::response &res, context &ctx)
    {
        delete ctx.user;
    }
};

#endif
