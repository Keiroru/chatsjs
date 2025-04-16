namespace chatjs_gui
{
    partial class Form2
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            usernameText = new Label();
            exitButton = new Button();
            logoutButton = new Button();
            goToUsersButton = new Button();
            goToBugReportsButton = new Button();
            reportedMessagesButton = new Button();
            label1 = new Label();
            SuspendLayout();
            // 
            // usernameText
            // 
            usernameText.AutoSize = true;
            usernameText.Font = new Font("Segoe UI", 14F, FontStyle.Bold);
            usernameText.ForeColor = Color.White;
            usernameText.Location = new Point(85, 129);
            usernameText.Name = "usernameText";
            usernameText.Size = new Size(65, 25);
            usernameText.TabIndex = 0;
            usernameText.Text = "label1";
            // 
            // exitButton
            // 
            exitButton.BackColor = Color.Red;
            exitButton.Location = new Point(85, 322);
            exitButton.Name = "exitButton";
            exitButton.Size = new Size(134, 49);
            exitButton.TabIndex = 1;
            exitButton.Text = "Exit to desktop";
            exitButton.UseVisualStyleBackColor = false;
            exitButton.Click += exitButton_Click;
            // 
            // logoutButton
            // 
            logoutButton.BackColor = Color.FromArgb(64, 0, 64);
            logoutButton.Location = new Point(85, 249);
            logoutButton.Name = "logoutButton";
            logoutButton.Size = new Size(134, 49);
            logoutButton.TabIndex = 2;
            logoutButton.Text = "Logout";
            logoutButton.UseVisualStyleBackColor = false;
            logoutButton.Click += logoutButton_Click;
            // 
            // goToUsersButton
            // 
            goToUsersButton.BackColor = Color.FromArgb(0, 0, 192);
            goToUsersButton.Location = new Point(512, 60);
            goToUsersButton.Name = "goToUsersButton";
            goToUsersButton.Size = new Size(188, 70);
            goToUsersButton.TabIndex = 3;
            goToUsersButton.Text = "Go to users";
            goToUsersButton.UseVisualStyleBackColor = false;
            goToUsersButton.Click += goToUsersButton_Click;
            // 
            // goToBugReportsButton
            // 
            goToBugReportsButton.BackColor = Color.FromArgb(0, 0, 192);
            goToBugReportsButton.Location = new Point(512, 182);
            goToBugReportsButton.Name = "goToBugReportsButton";
            goToBugReportsButton.Size = new Size(188, 70);
            goToBugReportsButton.TabIndex = 4;
            goToBugReportsButton.Text = "Go to bug reports";
            goToBugReportsButton.UseVisualStyleBackColor = false;
            goToBugReportsButton.Click += goToBugReportsButton_Click;
            // 
            // reportedMessagesButton
            // 
            reportedMessagesButton.BackColor = Color.FromArgb(0, 0, 192);
            reportedMessagesButton.Location = new Point(512, 306);
            reportedMessagesButton.Name = "reportedMessagesButton";
            reportedMessagesButton.Size = new Size(188, 70);
            reportedMessagesButton.TabIndex = 5;
            reportedMessagesButton.Text = "Go to reported messages";
            reportedMessagesButton.UseVisualStyleBackColor = false;
            reportedMessagesButton.Click += customSqlButton_Click;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            label1.ForeColor = Color.FromArgb(224, 224, 224);
            label1.Location = new Point(85, 83);
            label1.Name = "label1";
            label1.Size = new Size(178, 21);
            label1.TabIndex = 6;
            label1.Text = "Currently logged in as";
            // 
            // Form2
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(30, 30, 30);
            ClientSize = new Size(800, 450);
            Controls.Add(label1);
            Controls.Add(reportedMessagesButton);
            Controls.Add(goToBugReportsButton);
            Controls.Add(goToUsersButton);
            Controls.Add(logoutButton);
            Controls.Add(exitButton);
            Controls.Add(usernameText);
            Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            ForeColor = Color.White;
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            Name = "Form2";
            StartPosition = FormStartPosition.CenterParent;
            Text = "ChatJS Admin Panel";
            Load += Form2_Load;
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label usernameText;
        private Button exitButton;
        private Button logoutButton;
        private Button goToUsersButton;
        private Button goToBugReportsButton;
        private Button reportedMessagesButton;
        private Label label1;
    }
}