using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace chatjs_gui
{
    public partial class Form3 : Form
    {
        DataGridViewCellEventArgs prewRow = null;
        int userId = 0;
        string where = "";

        public Form3()
        {
            InitializeComponent();
            LoadUsers();
        }

        private void LoadUsers()
        {
            usersDataGrid.AllowUserToAddRows = false;
            usersDataGrid.Rows.Clear();
            usersDataGrid.ForeColor = Color.Black;

            string sql = "select displayName, displayId, email, telephone, isSiteAdmin, isBanned from users" + where;

            Database db = new Database(sql);
            while (db.Reader.Read())
            {
                string name = db.Reader.GetString("displayName");
                string id = db.Reader.GetString("displayId");
                string email = db.Reader.GetString("email");
                string telephone = db.Reader.IsDBNull("telephone") ? "empty" : db.Reader.GetString("telephone");
                bool isSiteAdmin = db.Reader.GetBoolean("isSiteAdmin");
                bool isBanned = db.Reader.GetBoolean("isBanned");
                usersDataGrid.Rows.Add(name, id, email, telephone, isSiteAdmin, isBanned);
            }

            db.EndConnection();
            prewRow = null;
        }

        private void usersDataGrid_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            
        }

        private void usersDataGrid_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex < 0) return;

            var row = usersDataGrid.Rows[e.RowIndex];
            string displayName = row.Cells["displayName"].Value?.ToString() ?? "";
            string displayId = row.Cells["displayId"].Value?.ToString() ?? "";

            if (prewRow != null) usersDataGrid.Rows[prewRow.RowIndex].DefaultCellStyle.BackColor = Color.White;
            usersDataGrid.Rows[e.RowIndex].DefaultCellStyle.BackColor = Color.Yellow;
            prewRow = e;

            string sql = $"select userId, isBanned, isSiteAdmin from users where displayName = '{displayName}' and displayId = '{displayId}'";
            bool isBanned = false;
            bool isSiteAdmin = false;

            Database db = new Database(sql);
            while (db.Reader.Read())
            {
                isBanned = db.Reader.GetBoolean("isBanned");
                isSiteAdmin = db.Reader.GetBoolean("isSiteAdmin");
                userId = db.Reader.GetInt32("userId");
            }
            db.EndConnection();

            banButton.Text = isBanned ? "Unban user" : "Ban user";
            siteAdminButton.Text = isSiteAdmin ? "Remove site admin" : "Make site admin";

            controlsGroupBox.Visible = true;
        }

        private void backButton_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void siteAdminButton_Click(object sender, EventArgs e)
        {
            string sql = $"UPDATE users SET isSiteAdmin = CASE WHEN isSiteAdmin = 1 THEN 0 WHEN isSiteAdmin = 0 THEN 1 ELSE isSiteAdmin END" +
                $" WHERE userId = {userId}";
            Database db = new Database(sql);
            db.EndConnection();

            if (siteAdminButton.Text == "Make site admin")
            {
                siteAdminButton.Text = "Remove site admin";
                usersDataGrid.Rows[prewRow.RowIndex].Cells["isSiteAdmin"].Value = "True";
            }
            else
            {
                siteAdminButton.Text = "Make site admin"; ;
                usersDataGrid.Rows[prewRow.RowIndex].Cells["isSiteAdmin"].Value = "False";
            }
        }

        private void banButton_Click(object sender, EventArgs e)
        {
            string sql = $"UPDATE users SET isBanned = CASE WHEN isBanned = 1 THEN 0 WHEN isBanned = 0 THEN 1 ELSE isBanned END" +
                $" WHERE userId = {userId}";
            Database db = new Database(sql);
            db.EndConnection();

            if (banButton.Text == "Unban user")
            {
                banButton.Text = "Ban user";
                usersDataGrid.Rows[prewRow.RowIndex].Cells["isBanned"].Value = "False";
            }
            else
            {
                banButton.Text = "Unban user";
                usersDataGrid.Rows[prewRow.RowIndex].Cells["isBanned"].Value = "True";
            }
        }

        private void nameInputField_TextChanged(object sender, EventArgs e)
        {
            prewRow = null;
            controlsGroupBox.Visible = false;

            string whereClause = "";

            if (nameInputField.Text.Length > 0)
            {
                whereClause += $"displayName LIKE '{MySqlHelper.EscapeString(nameInputField.Text)}%'";
            }

            if (idInputField.Text.Length > 0)
            {
                if (whereClause.Length > 0)
                {
                    whereClause += $" {andOrButton.Text} ";
                }
                else
                {
                    whereClause = "";
                }

                whereClause += $"displayId LIKE '{MySqlHelper.EscapeString(idInputField.Text)}%'";
            }

            if (whereClause.Length > 0)
            {
                where = " WHERE " + whereClause;
            }
            else
            {
                where = "";
            }

            backButton.Text = whereClause;
            LoadUsers();
        }

        private void idInputField_TextChanged_1(object sender, EventArgs e)
        {
            nameInputField_TextChanged(sender, e);
        }

        private void andOrButton_Click(object sender, EventArgs e)
        {
            if (andOrButton.Text == "And")
            {
                andOrButton.Text = "Or";
            }
            else
            {
                andOrButton.Text = "And";
            }

            nameInputField_TextChanged(sender, e);
        }
    }
}
