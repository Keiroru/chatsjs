using Microsoft.VisualBasic.ApplicationServices;
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
    public partial class Form2 : Form
    {
        private string userId;

        public Form2(string userId)
        {
            InitializeComponent();
            this.userId = userId;
        }

        private void Form2_Load(object sender, EventArgs e)
        {
            GetUserData();
        }

        private void GetUserData()
        {
            string sql = $"SELECT displayName, displayId FROM users WHERE userId = {userId}";
            Database db = new Database(sql);

            while (db.Reader.Read())
            {
                usernameText.Text = $"Currently logged in as {db.Reader.GetString("displayName")} #{db.Reader.GetString("displayId")}";
            }

            db.EndConnection();
        }

        private void logoutButton_Click(object sender, EventArgs e)
        {
            loginForm loginForm = new loginForm();
            loginForm.Show();
            Close();
        }

        private void exitButton_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void goToUsersButton_Click(object sender, EventArgs e)
        {
            Form3 form3 = new Form3();
            form3.ShowDialog();
        }

        private void goToBugReportsButton_Click(object sender, EventArgs e)
        {
            Form4 form4 = new Form4();
            form4.ShowDialog();
        }

        private void customSqlButton_Click(object sender, EventArgs e)
        {
            Form5 form5 = new Form5();
            form5.ShowDialog();
        }
    }
}
