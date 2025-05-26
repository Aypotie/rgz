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
        // if (conn.is_open())
        // {
        //     cout << "Closing database connection..." << endl;
        //     conn.disconnect();
        // }
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

    pair<vector<IncidentListItem>, int> getIncidents(int sectorID, int page, int limit)
    {
        lock_guard<mutex> lock(db_mutex);
        int offset = (page - 1) * limit;
        bool isParam = false;
        vector<IncidentListItem> incidentList;
        pqxx::work tx{conn};

        // 1. Запрос для получения данных с пагинацией
        string query = "SELECT "
                       "i.id, i.created_at, i.incident_time, i.description, "
                       "s.name AS sector_name, "
                       "st.name AS status_name "
                       "FROM incident i "
                       "JOIN sector s ON s.id = i.sector_id "
                       "JOIN status st ON st.id = i.status_id";

        if (sectorID != 0)
        {
            query += " WHERE s.id = $1";
            isParam = true;
        }

        // Добавляем сортировку для стабильной пагинации
        query += " ORDER BY i.id";

        if (limit > 0)
        {
            query += " LIMIT " + to_string(limit);
        }
        if (offset > 0)
        {
            query += " OFFSET " + to_string(offset);
        }

        pqxx::result res;
        if (isParam)
        {
            res = tx.exec_params(query, sectorID);
        }
        else
        {
            res = tx.exec(query);
        }

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

        // 2. Запрос для получения общего количества
        string countQuery = "SELECT COUNT(*) FROM incident i";
        if (sectorID != 0)
        {
            countQuery += " WHERE i.sector_id = " + to_string(sectorID);
        }

        pqxx::result countRes = tx.exec(countQuery);
        int totalCount = countRes[0][0].as<int>();

        tx.commit();

        return make_pair(incidentList, totalCount);
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

    void updateIncident(
        const string &incidentTime, const string &description, int statusId,
        int typeIncidentId, int criticalLevelId,
        int incidentId)
    {
        lock_guard<mutex> lock(db_mutex);
        pqxx::work tx{conn};

        pqxx::result res = tx.exec_params(
            "UPDATE incident SET incident_time=$1, description=$2, status_id=$3, type_incident_id=$4, "
            "critical_level_id=$5 WHERE id = $6",
            incidentTime, description, statusId, typeIncidentId, criticalLevelId, incidentId);

        tx.commit();
    }

    void deleteIncident(int id)
    {
        lock_guard<mutex> lock(db_mutex);
        pqxx::work tx{conn};

        pqxx::result res = tx.exec_params("DELETE FROM incident WHERE id = $1", id);

        tx.commit();
    };

    Incident getIncident(int id)
    {
        lock_guard<mutex> lock(db_mutex);
        pqxx::work tx{conn};

        pqxx::result res = tx.exec_params(R"(
        SELECT 
            i.id,
            i.created_at,
            i.incident_time,
            i.description,
            s.name AS sector,
            st.name AS status,
            ti.name AS type,
            cl.name AS critical_level,
            sm.id AS securityman_id,
            sm.surname,
            sm.name,
            sm.last_name
        FROM incident i
        JOIN sector s ON s.id = i.sector_id
        JOIN status st ON st.id = i.status_id
        JOIN type_incident ti ON ti.id = i.type_incident_id
        JOIN critical_level cl ON cl.id = i.critical_level_id
        JOIN securityman sm ON sm.id = i.securityman_id
        WHERE i.id = $1
    )",
                                          id);

        if (res.empty())
            throw runtime_error("Инцидент не найден");

        const auto &row = res[0];
        Incident incident;
        incident.id = row["id"].as<int>();
        incident.created_time = row["created_at"].as<string>();
        incident.incident_time = row["incident_time"].as<string>();
        incident.description = row["description"].as<string>();
        incident.sector = row["sector"].as<string>();
        incident.status = row["status"].as<string>();
        incident.type = row["type"].as<string>();
        incident.critical_level = row["critical_level"].as<string>();
        incident.securityman_id = row["securityman_id"].as<int>();
        incident.securityman_name = row["name"].as<string>();
        incident.securityman_surname = row["surname"].as<string>();
        incident.securityman_lastname = row["last_name"].as<string>();

        return incident;
    }
};
#endif