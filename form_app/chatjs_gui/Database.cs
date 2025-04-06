using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace chatjs_gui
{
    internal class Database
    {
        private string serverConnect;
        MySqlConnection connection;
        MySqlCommand command;
        MySqlDataReader reader;

        public MySqlDataReader Reader { get => reader; set => reader = value; }

        public Database(string sql)
        {
            string server = "chatdb.cryegskk82pm.eu-north-1.rds.amazonaws.com";
            string port = "6969";
            string database = "chatdb";
            string user = "Trixep11";
            string password = "Trixep11&";
            serverConnect = $"server={server};port={port};database={database};user id={user};password={password}";

            connection = new MySqlConnection(serverConnect);
            connection.Open();
            command = new MySqlCommand(sql, connection);
            reader = command.ExecuteReader();
        }

        public void EndConnection()
        {
            connection.Close();
        }

        ~Database()
        {
            connection.Close();
        }
    }
}
