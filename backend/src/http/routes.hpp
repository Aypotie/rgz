#ifndef ROUTES_HPP
#define ROUTES_HPP

#include "../../lib/crow_all.h"
#include "middlewares/cors.hpp"
#include "middlewares/auth.hpp"
#include "handlers.hpp"

void initRoutes(crow::App<crow::CORSHandler, AuthMiddleware> &app, Handlers &h)
{
    CROW_ROUTE(app, "/api/status")
        .CROW_MIDDLEWARES(app, AuthMiddleware)
        .methods("GET"_method)([&h]()
                               { return h.getStatus(); });

    CROW_ROUTE(app, "/api/type")
        .CROW_MIDDLEWARES(app, AuthMiddleware)
        .methods("GET"_method)([&h]()
                               { return h.getType(); });

    CROW_ROUTE(app, "/api/sector")
        .CROW_MIDDLEWARES(app, AuthMiddleware)
        .methods("GET"_method)([&h]()
                               { return h.getSector(); });

    CROW_ROUTE(app, "/api/securityman/login")
        .methods("POST"_method)([&h](const crow::request &req, crow::response &res)
                                { return h.login(req, res); });
    CROW_ROUTE(app, "/api/securityman")
        .CROW_MIDDLEWARES(app, AuthMiddleware)
        .methods("GET"_method)([&h, &app](const crow::request &req, crow::response &res)
                               {
        auto& ctx = app.get_context<AuthMiddleware>(req);
        h.getUser(ctx, res); });

    CROW_ROUTE(app, "/api/securityman/logout")
        .methods("GET"_method)([&h](const crow::request &req, crow::response &res)
                               { return h.logout(req, res); });
    CROW_ROUTE(app, "/api/incident")
        .CROW_MIDDLEWARES(app, AuthMiddleware)
        .methods("GET"_method)([&h]()
                               { return h.getIncidents(); });
}

#endif