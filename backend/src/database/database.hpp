#ifndef STORAGE_HPP
#define STORAGE_HPP

#include <iostream>
#include <pqxx/pqxx>
#include <mutex>
#include <string>
#include <stdio.h>
#include <vector>
#include <map>

#include "../models/models.hpp"

using namespace std;

class Database
{
private:
    pqxx::connection conn;
    mutex db_mutex;

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

    vector<Status> getStatus()
    {
        lock_guard<mutex> lock(db_mutex);
        vector<Status> statusList;
        pqxx::work tx{conn};

        pqxx::result res = tx.exec("SELECT id, name FROM status");

        for (const auto &row : res)
        {
            Status status;
            status.id = row[0].as<int>();
            status.name = row[1].as<string>();
            statusList.push_back(status);
        }

        tx.commit();

        return statusList;
    }

    vector<Type> getType()
    {
        lock_guard<mutex> lock(db_mutex);
        vector<Type> typeList;
        pqxx::work tx{conn};

        pqxx::result res = tx.exec("SELECT id, name FROM type_incident");

        for (const auto &row : res)
        {
            Type type;
            type.id = row[0].as<int>();
            type.name = row[1].as<string>();
            typeList.push_back(type);
        }

        tx.commit();

        return typeList;
    }

    vector<Sector> getSector()
    {
        lock_guard<mutex> lock(db_mutex);
        vector<Sector> sectorList;
        pqxx::work tx{conn};

        pqxx::result res = tx.exec("SELECT id, name FROM sector");

        for (const auto &row : res)
        {
            Sector sector;
            sector.id = row[0].as<int>();
            sector.name = row[1].as<string>();
            sectorList.push_back(sector);
        }

        tx.commit();

        return sectorList;
    }

    // vector<Securityman> getSecurityman()
    // {
    //     lock_guard<mutex> lock(db_mutex);
    //     vector<Securityman> securitymanList;
    //     pqxx::work tx{conn};

    //     pqxx::result res = tx.exec("SELECT id, surname, name, last_name, phone, password FROM securityman WHERE phone = $1");

    //     for (const auto &row : res)
    //     {
    //         Securityman sector;
    //         Securityman.id = row[0].as<int>();
    //         Securityman.phone = row[4].as<string>();
    //         securitymanList.push_back(sector);
    //     }

    //     tx.commit();

    //     return securitymanList;
    // }

    Securityman *getSecuritymanByPhone(const string &phone)
    {
        lock_guard<mutex> lock(db_mutex);
        pqxx::work tx{conn};

        pqxx::result res = tx.exec_params(
            "SELECT id, surname, name, last_name, phone, password FROM securityman WHERE phone = $1",
            phone);

        if (res.empty())
            return nullptr;

        const auto &row = res[0];
        Securityman *user = new Securityman{};
        user->id = row[0].as<int>();
        user->surname = row[1].as<string>();
        user->name = row[2].as<string>();
        user->last_name = row[3].as<string>();
        user->phone = row[4].as<string>();
        user->password = row[5].as<string>();

        return user;
    }
};

#endif