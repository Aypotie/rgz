#ifndef HANDLERS_HPP
#define HANDLERS_HPP

#include <string>
#include <vector>

#include "../database/database.hpp"

using namespace std;

class Handlers
{
private:
    Database *db;

public:
    Handlers(Database *db)
    {
        this->db = db;
    }

    string getUser()
    {
        return "User";
    }

    string getSection()
    {
        return "Section";
    }
};
#endif