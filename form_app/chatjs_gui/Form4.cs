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
        bool isClosedTickets = false;

        public Form4()
        {
            InitializeComponent();
            LoadBugs(isClosedTickets);
        }

        private void LoadBugs(bool isClosed)
        {
            reportsDataGrid.AllowUserToAddRows = false;
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
            reportId = int.Parse(row.Cells["bugReportId"].Value?.ToString());

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

            doneButton.Text = isClosedTickets ? "Re-open ticket" : "Mark as done";

            titleText.Visible = true;
            doneButton.Visible = true;
        }
        private void backButton_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void refreshButton_Click(object sender, EventArgs e)
        {
            LoadBugs(isClosedTickets);
        }

        private void doneButton_Click(object sender, EventArgs e)
        {
            string sql = $"UPDATE bugreports SET isClosed = CASE WHEN isClosed = 1 THEN 0 WHEN isClosed = 0 THEN 1 ELSE isClosed END" +
                $" WHERE bugReportId = {reportId}";

            Database db = new Database(sql);
            db.EndConnection();

            doneButton.Visible = false;
            titleText.Visible = false;
            descriptionText.Text = "";

            LoadBugs(isClosedTickets);
        }

        private void openTicketsRadioButton_CheckedChanged(object sender, EventArgs e)
        {
            isClosedTickets = false;
            LoadBugs(isClosedTickets);
        }

        private void closedTicketsRadioButton_CheckedChanged(object sender, EventArgs e)
        {
            isClosedTickets = true;
            LoadBugs(isClosedTickets);
        }
    }
}
