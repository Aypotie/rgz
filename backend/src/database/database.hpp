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

    vector<IncidentListItem> getIncidents()
    {
        lock_guard<mutex> lock(db_mutex);
        vector<IncidentListItem> incidentList;
        pqxx::work tx{conn};

        pqxx::result res = tx.exec(
            "SELECT "
            "i.id, i.created_at, i.incident_time, i.description, "
            "s.name AS sector_name, "
            "st.name AS status_name "
            "FROM incident i "
            "JOIN sector s ON s.id = i.sector_id "
            "JOIN status st ON st.id = i.status_id ");

        for (const auto &row : res)
        {
            IncidentListItem incident;

            incident.id = row["id"].as<int>();
            incident.created_time = row["created_at"].as<string>();
            incident.incident_time = row["incident_time"].as<string>();
            incident.description = row["description"].as<string>();
            incident.sector = row["sector_name"].as<string>();
            incident.status = row["status_name"].as<string>();

            incidentList.push_back(incident);
        }

        tx.commit();

        return incidentList;
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

    int createIncident(const string &incidentTime, const string &description, int statusId, int securitymanId, int typeIncidentId, string sector, int criticalLevelId)
    {
        lock_guard<mutex> lock(db_mutex);
        pqxx::work tx{conn};

        pqxx::result res = tx.exec_params(
            "INSERT INTO incident (incident_time, description, status_id, type_incident_id, sector_id, securityman_id, critical_level_id) "
            "VALUES ($1, $2, $3, $4, (SELECT id FROM sector WHERE name=$5), $6, $7) RETURNING id",
            incidentTime, description, statusId, typeIncidentId, sector, securitymanId, criticalLevelId);

        tx.commit();

        return res[0][0].as<int>();
    }
};

#endif