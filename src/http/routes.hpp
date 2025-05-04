#ifndef ROUTES_HPP
#define ROUTES_HPP

#include "../../lib/crow_all.h"
#include "handlers.hpp"

void initRoutes(crow::SimpleApp &app, Handlers &h)
{
    CROW_ROUTE(app, "/api/user")
        .methods("GET"_method)([&h]()
                               { return h.getUser(); });

    CROW_ROUTE(app, "/api/section")
        .methods("GET"_method)([&h]()
                               { return h.getSection(); });
}

#endif