#include <iostream>
#include <pqxx/pqxx>

#include "lib/crow_all.h"
#include "src/http/routes.hpp"
#include "src/http/handlers.hpp"
#include "src/config/config.hpp"

#include "src/database/database.hpp"
#include "src/http/middlewares/cors.hpp"
#include "src/http/middlewares/auth.hpp"

using namespace pqxx;
using namespace std;

int main()
{
    try
    {
        config cfg = loadConfig();
        globalAppConfig = &cfg.appConfig;

        string connInfo = "dbname=" + cfg.dbConfig.dbName + " user=" + cfg.dbConfig.username + " password=" + cfg.dbConfig.password + " hostaddr=" + cfg.dbConfig.host + " port=" + to_string(cfg.dbConfig.port);
        Database db(connInfo);

        auto h = Handlers(db, cfg.appConfig);
        crow::App<crow::CORSHandler, AuthMiddleware> app;
        auto &cors = app.get_middleware<crow::CORSHandler>();
        cors
            .global()
            .methods("POST"_method, "GET"_method, "OPTIONS"_method)
            .prefix("/api")
            .origin("http://localhost:5173")
            .allow_credentials()
            .headers("Content-Type", "Authorization");

        initRoutes(app, h);
        app.port(cfg.appConfig.port).multithreaded().run();
    }
    catch (exception const &e)
    {
        cerr << "ERROR: " << e.what() << '\n';
        return 1;
    }
    return 0;
}