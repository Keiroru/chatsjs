namespace chatjs_gui
{
    public partial class loginForm : Form
    {
        private System.Windows.Forms.Timer errorTimer;

        public loginForm()
        {
            InitializeComponent();
            this.AcceptButton = loginButton;
            usernameInputField.Text = "trixep11@gmail.com";
            passwordInputField.Text = "Trixep11";
        }

        private void loginButton_Click(object sender, EventArgs e)
        {
            string user = usernameInputField.Text;
            string password = passwordInputField.Text;
            string storedHash = null;
            string userId = null;

            if (user == "" || password == "") return;
            string sql = $"SELECT userId, password, isSiteAdmin FROM users WHERE email = '{user}' OR telephone = '{user}'";
            Database db = new Database(sql);

            while (db.Reader.Read())
            {
                if (!db.Reader.GetBoolean("isSiteAdmin"))
                {
                    errorText.Visible = true;
                    db.EndConnection();
                    return;
                }
                else
                {
                    storedHash = db.Reader.GetString("password");
                    userId = db.Reader.GetInt32("userId").ToString();
                }
            }

            db.EndConnection();

            if (storedHash != null && BCrypt.Net.BCrypt.Verify(password, storedHash))
            {
                Form2 form2 = new Form2(userId);
                Hide();
                form2.ShowDialog();
            }
            else
            {
                errorText.Visible = true;

                if (errorTimer == null)
                {
                    errorTimer = new System.Windows.Forms.Timer();
                    errorTimer.Interval = 3000;
                    errorTimer.Tick += (s, args) =>
                    {
                        errorText.Visible = false;
                        errorTimer.Stop();
                    };
                }

                errorTimer.Start();
            }
        }
    }
}
