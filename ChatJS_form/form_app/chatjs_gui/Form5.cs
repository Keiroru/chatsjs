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
    public partial class Form5 : Form
    {
        DataGridViewCellEventArgs prewRow = null;
        int messageId = 0;

        public Form5()
        {
            InitializeComponent();
            LoadReports();
        }

        private void LoadReports()
        {
            reportsDataGrid.AllowUserToAddRows = false;
            reportsDataGrid.Rows.Clear();
            reportsDataGrid.ForeColor = Color.Black;

            string sql = "select users.displayName, users.displayId, messages.messageId from users" +
                         " inner join messages on users.userId = messages.senderUserId" +
                         $" where messages.isReported = 1";

            Database db = new Database(sql);

            while (db.Reader.Read())
            {
                string nev = db.Reader.GetString("displayName");
                string userId = db.Reader.GetString("displayId");
                string messageId = db.Reader.GetInt32("messageId").ToString();

                reportsDataGrid.Rows.Add(nev, userId, messageId);
            }

            db.EndConnection();

            messageText.Text = "";
            dateText.Visible = false;
            prewRow = null;
        }

        private void backButton_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void refreshButton_Click(object sender, EventArgs e)
        {
            LoadReports();
        }

        private void reportsDataGrid_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex < 0) return;

            var row = reportsDataGrid.Rows[e.RowIndex];
            messageId = int.Parse(row.Cells["reportedMessageId"].Value?.ToString());

            if (prewRow != null) reportsDataGrid.Rows[prewRow.RowIndex].DefaultCellStyle.BackColor = Color.White;
            reportsDataGrid.Rows[e.RowIndex].DefaultCellStyle.BackColor = Color.Yellow;
            prewRow = e;

            string sql = $"select messages.messageText, messages.sentAt, messages.isDeleted, users.isBanned from messages" +
                $" inner join users on messages.senderUserId = users.userId where messages.messageId = {messageId}";

            string text = "";
            string date = "";
            bool isDeleted = false;
            bool isBanned = false;

            Database db = new Database(sql);
            while (db.Reader.Read())
            {
                text = db.Reader.GetString("messageText");
                date = db.Reader.GetDateTime("sentAt").ToString("yyyy. MM. dd.");
                isDeleted = db.Reader.GetBoolean("isDeleted");
                isBanned = db.Reader.GetBoolean("isBanned");
            }
            db.EndConnection();

            messageText.Text = text;
            dateText.Text = date;

            dateText.Visible = true;
            deleteMessageButton.Visible = isDeleted ? false : true;
            banUserButton.Visible = isBanned ? false : true;
            closeReportButton.Visible = true;
        }

        private void deleteMessageButton_Click(object sender, EventArgs e)
        {
            string sql = $"UPDATE messages SET isDeleted = 1 WHERE messageId = {messageId}";

            Database db = new Database(sql);
            db.EndConnection();

            deleteMessageButton.Visible = false;
        }

        private void banUserButton_Click(object sender, EventArgs e)
        {
            string sql = $"UPDATE users SET isBanned = 1 WHERE userId = (SELECT senderUserId FROM messages WHERE messageId = {messageId})";

            Database db = new Database(sql);
            db.EndConnection();

            banUserButton.Visible = false;
        }

        private void closeReportButton_Click(object sender, EventArgs e)
        {
            string sql = $"UPDATE messages SET isReported = 0 WHERE messageId = {messageId}";

            Database db = new Database(sql);
            db.EndConnection();

            deleteMessageButton.Visible = false;
            banUserButton.Visible = false;
            closeReportButton.Visible = false;

            LoadReports();
        }

        private void reportsDataGrid_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
           
        }
    }
}
