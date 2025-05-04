#ifndef STORAGE_HPP
#define STORAGE_HPP

#include <iostream>
#include <pqxx/pqxx>
#include <string>
#include <stdio.h>
#include <vector>
#include <map>

using namespace std;

class Database
{
private:
    pqxx::connection conn;

public:
    Database(string connInfo) : conn(connInfo)
    {
    }

    ~Database()
    {
        if (conn.is_open())
        {
            cout << "Closing database connection..." << endl;
            conn.disconnect();
        }
    }
};

#endif