#ifndef CORS_HPP
#define CORS_HPP

#include "../../../lib/crow_all.h"

struct CORS
{
    struct context
    {
    };

    void before_handle(crow::request &req, crow::response &res, context &)
    {
        // CORS-заголовки всегда
        res.add_header("Access-Control-Allow-Origin", "http://localhost:5173");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.add_header("Access-Control-Allow-Credentials", "true");
        res.add_header("Access-Control-Max-Age", "86400");

        // Обработка preflight-запроса (OPTIONS)
        if (req.method == "OPTIONS"_method)
        {
            res.code = 204;
            res.end();
            return;
        }
    }

    void after_handle(crow::request &, crow::response &, context &)
    {
        // Больше ничего не нужно тут
    }
};

#endif
