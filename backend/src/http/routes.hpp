#ifndef ROUTES_HPP
#define ROUTES_HPP

#include "../../lib/crow_all.h"
#include "middlewares/cors.hpp"
#include "middlewares/auth.hpp"
#include "handlers.hpp"

void initRoutes(crow::App<CORS, AuthMiddleware> &app, Handlers &h)
{
    // CROW_ROUTE(app, "/api/securityman")
    //     .methods("GET"_method)([&h]()
    //                            { return h.getUser(); });

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
}

#endif