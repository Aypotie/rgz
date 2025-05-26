#ifndef CONFIG_HPP
#define CONFIG_HPP

#include <iostream>
#include <string>
#include "../../lib/dotenv.hpp"

using namespace std;

struct DBConfig
{
    string host;
    int port;
    string password;
    string username;
    string dbName;
};

struct AppConfig
{
    string env;
    string host;
    int port;
    string jwtSecret;
    int jwtTTLHours;
};

struct config
{
    DBConfig dbConfig;
    AppConfig appConfig;
};

config loadConfig()
{
    load_env(".env");

    // DBConfig config

    config cfg;
    cfg.appConfig.env = get_env_or_throw("ENV");

    DBConfig dbcfg;
    dbcfg.host = get_env_or_throw("POSTGRES_HOST");
    dbcfg.port = atoi(get_env_or_throw("POSTGRES_PORT"));
    dbcfg.username = get_env_or_throw("POSTGRES_USER");
    dbcfg.password = get_env_or_throw("POSTGRES_PASSWORD");
    dbcfg.dbName = get_env_or_throw("POSTGRES_DB");
    cfg.dbConfig = dbcfg;

    AppConfig appCfg;
    appCfg.host = get_env_or_throw("APP_HOST");
    appCfg.port = atoi(get_env_or_throw("APP_PORT"));
    appCfg.jwtSecret = get_env_or_throw("APP_JWT_SECRET");
    appCfg.jwtTTLHours = atoi(get_env_or_throw("APP_JWT_TTL_HOURS"));
    cfg.appConfig = appCfg;

    return cfg;
}

#endif