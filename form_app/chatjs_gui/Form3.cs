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
        public Form3()
        {
            InitializeComponent();
            LoadUsers();
        }

        private void LoadUsers()
        {
            usersDataGrid.Rows.Clear();

            string sql = "select displayName, displayId, email, telephone, isSiteAdmin, isBanned from users";

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
        }

        private void usersDataGrid_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }

        private void usersDataGrid_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            var row = usersDataGrid.Rows[e.RowIndex];
            string displayName = row.Cells["displayName"].Value?.ToString() ?? "";
            string displayId = row.Cells["displayId"].Value?.ToString() ?? "";

            usersDataGrid.BackColor = Color.White;
            usersDataGrid.Rows[e.RowIndex].DefaultCellStyle.BackColor = Color.Yellow;
            string sql = $"select isBanned, isSiteAdmin from users where displayName = {displayName} and displayId = {displayId}";
            bool isBanned = false;
            bool isSiteAdmin = false;

            Database db = new Database(sql);
            while (db.Reader.Read())
            {
                isBanned = db.Reader.GetBoolean("isBanned");
                isSiteAdmin = db.Reader.GetBoolean("isSiteAdmin");
            }

            banButton.Text = isBanned ? "Unban user" : "Ban user";
            siteAdminButton.Text = isSiteAdmin ? "Remove site admin" : "Make site admin";

            controlsGroupBox.Visible = true;
        }

        private void backButton_Click(object sender, EventArgs e)
        {
            Close();
        }
    }
}
