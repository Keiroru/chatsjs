using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace chatjs_gui
{
    public partial class Form6 : Form
    {
        int userId = 0;
        DataGridViewCellEventArgs prewRow = null;
        public Form6(int userId)
        {
            this.userId = userId;
            InitializeComponent();
            LoadUser();
        }

        private void LoadUser()
        {
            usersDataGrid.AllowUserToAddRows = false;
            usersDataGrid.Rows.Clear();
            usersDataGrid.ForeColor = Color.Black;

            usersDataGrid.Columns.Add("Field", "Field");
            usersDataGrid.Columns.Add("Value", "Value");

            usersDataGrid.Columns[0].AutoSizeMode = DataGridViewAutoSizeColumnMode.AllCells;
            usersDataGrid.Columns[1].AutoSizeMode = DataGridViewAutoSizeColumnMode.Fill;

            string sql = $"SELECT * FROM users WHERE userId = {userId}";

            Database db = new Database(sql);
            if (db.Reader.Read())
            {
                for (int i = 0; i < db.Reader.FieldCount; i++)
                {
                    string fieldName = db.Reader.GetName(i);
                    object value = db.Reader.IsDBNull(i) ? "NULL" : db.Reader.GetValue(i);
                    usersDataGrid.Rows.Add(fieldName, value.ToString());
                }
            }

            db.EndConnection();
        }

        private void backButton_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            string sql = $"select profilePicPath from users where userId = {userId}";
            string url = "";

            Database db = new Database(sql);
            while (db.Reader.Read())
            {
                if (!db.Reader.IsDBNull(db.Reader.GetOrdinal("profilePicPath")))
                {
                    url = db.Reader.GetString(db.Reader.GetOrdinal("profilePicPath"));
                }
            }
            db.EndConnection();

            if (!string.IsNullOrEmpty(url))
            {
                var viewer = new ImageViewerForm(url);
                viewer.Show();
            }
            else
            {
                noPfpText.Visible = true;
            }
        }

        private void usersDataGrid_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }

        private void usersDataGrid_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex < 0) return;

            var row = usersDataGrid.Rows[e.RowIndex];

            if (prewRow != null) usersDataGrid.Rows[prewRow.RowIndex].DefaultCellStyle.BackColor = Color.White;
            usersDataGrid.Rows[e.RowIndex].DefaultCellStyle.BackColor = Color.Yellow;
            prewRow = e;

            var value = row.Cells[1].Value?.ToString() ?? "";
            textBox.Text = value;
        }
    }
}
