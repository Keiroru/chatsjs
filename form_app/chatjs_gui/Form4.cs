using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.VisualBasic.ApplicationServices;

namespace chatjs_gui
{
    public partial class Form4 : Form
    {
        DataGridViewCellEventArgs prewRow = null;
        int reportId = 0;

        public Form4()
        {
            InitializeComponent();
            LoadBugs(false);
        }

        private void LoadBugs(bool isClosed)
        {
            reportsDataGrid.Rows.Clear();
            reportsDataGrid.ForeColor = Color.Black;

            int isClosedValue = isClosed ? 1 : 0;

            string sql = "select users.displayName, users.displayId, bugreports.header, bugreports.bugReportId from users" +
                " inner join bugreports on users.userId = bugreports.senderUserId" +
                $" where bugreports.isClosed = {isClosedValue}";

            Database db = new Database(sql);
            while (db.Reader.Read())
            {
                string nev = db.Reader.GetString("displayName");
                string userId = db.Reader.GetString("displayId");
                string state = db.Reader.GetString("header");
                string reportId = db.Reader.GetInt32("bugReportId").ToString();

                reportsDataGrid.Rows.Add(nev, userId, state, reportId);
            }

            db.EndConnection();
        }

        private void reportsDataGrid_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            var row = reportsDataGrid.Rows[e.RowIndex];
            string reportId = row.Cells["bugReportId"].Value?.ToString() ?? "";

            if (prewRow != null) reportsDataGrid.Rows[prewRow.RowIndex].DefaultCellStyle.BackColor = Color.White;
            reportsDataGrid.Rows[e.RowIndex].DefaultCellStyle.BackColor = Color.Yellow;
            prewRow = e;

            string sql = $"select header, description from bugreports where bugreportId = {reportId}";

            string title = "";
            string description = "";

            Database db = new Database(sql);
            while (db.Reader.Read())
            {
                title = db.Reader.GetString("header");
                description = db.Reader.GetString("description");
            }
            db.EndConnection();

            titleText.Text = title;
            descriptionText.Text = description;

            titleText.Visible = true;
            doneButton.Visible = true;
        }
        private void backButton_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void radioButton1_CheckedChanged(object sender, EventArgs e)
        {

        }


        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }

        private void label1_Click(object sender, EventArgs e)
        {

        }
    }
}
