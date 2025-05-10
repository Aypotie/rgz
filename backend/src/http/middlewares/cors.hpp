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
    }

    void after_handle(crow::request &req, crow::response &res, context &)
    {
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.add_header("Access-Control-Allow-Credentials", "true");
        res.add_header("Access-Control-Max-Age", "86400");
        if (req.method == "OPTIONS"_method)
        {
            res.code = 204;
            res.end();
            return;
        }
    }
};

#endif