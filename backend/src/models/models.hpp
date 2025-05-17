#ifndef MODELS_HPP
#define MODELS_HPP

#include "../../lib/crow_all.h"
#include <string>

using namespace std;

struct Status
{
    int id;
    string name;

    crow::json::wvalue render()
    {
        crow::json::wvalue x;
        x["id"] = id;
        x["name"] = name;
        return x;
    }
};

struct Type
{
    int id;
    string name;

    crow::json::wvalue render()
    {
        crow::json::wvalue x;
        x["id"] = id;
        x["name"] = name;
        return x;
    }
};

struct Sector
{
    int id;
    string name;

    crow::json::wvalue render()
    {
        crow::json::wvalue x;
        x["id"] = id;
        x["name"] = name;
        return x;
    }
};

struct Level
{
    int id;
    string name;

    crow::json::wvalue render()
    {
        crow::json::wvalue x;
        x["id"] = id;
        x["name"] = name;
        return x;
    }
};

struct Securityman
{
    int id;
    string surname;
    string name;
    string last_name;
    string phone;
    string password;

    crow::json::wvalue render()
    {
        crow::json::wvalue x;
        x["id"] = id;
        x["surname"] = surname;
        x["name"] = name;
        x["last_name"] = last_name;
        x["phone"] = phone;
        return x;
    }
};

struct IncidentListItem
{
    int id;
    string created_time;
    string incident_time;
    string description;
    string sector;
    string status;

    crow::json::wvalue render()
    {
        crow::json::wvalue x;
        x["id"] = id;
        x["created_at"] = created_time;
        x["incident_time"] = incident_time,
        x["description"] = description;
        x["sector"] = sector;
        x["status"] = status;
        return x;
    }
};

#endif