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
            customSqlButton = new Button();
            SuspendLayout();
            // 
            // usernameText
            // 
            usernameText.AutoSize = true;
            usernameText.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            usernameText.Location = new Point(56, 47);
            usernameText.Name = "usernameText";
            usernameText.Size = new Size(57, 21);
            usernameText.TabIndex = 0;
            usernameText.Text = "label1";
            // 
            // exitButton
            // 
            exitButton.BackColor = Color.FromArgb(64, 0, 64);
            exitButton.Location = new Point(40, 360);
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
            logoutButton.Location = new Point(40, 287);
            logoutButton.Name = "logoutButton";
            logoutButton.Size = new Size(134, 49);
            logoutButton.TabIndex = 2;
            logoutButton.Text = "Logout";
            logoutButton.UseVisualStyleBackColor = false;
            logoutButton.Click += logoutButton_Click;
            // 
            // goToUsersButton
            // 
            goToUsersButton.BackColor = Color.Navy;
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
            goToBugReportsButton.BackColor = Color.Navy;
            goToBugReportsButton.Location = new Point(512, 182);
            goToBugReportsButton.Name = "goToBugReportsButton";
            goToBugReportsButton.Size = new Size(188, 70);
            goToBugReportsButton.TabIndex = 4;
            goToBugReportsButton.Text = "Go to bug reports";
            goToBugReportsButton.UseVisualStyleBackColor = false;
            goToBugReportsButton.Click += goToBugReportsButton_Click;
            // 
            // customSqlButton
            // 
            customSqlButton.BackColor = Color.FromArgb(0, 0, 64);
            customSqlButton.Location = new Point(512, 306);
            customSqlButton.Name = "customSqlButton";
            customSqlButton.Size = new Size(188, 70);
            customSqlButton.TabIndex = 5;
            customSqlButton.Text = "Custom SQL";
            customSqlButton.UseVisualStyleBackColor = false;
            customSqlButton.Click += customSqlButton_Click;
            // 
            // Form2
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(30, 30, 30);
            ClientSize = new Size(800, 450);
            Controls.Add(customSqlButton);
            Controls.Add(goToBugReportsButton);
            Controls.Add(goToUsersButton);
            Controls.Add(logoutButton);
            Controls.Add(exitButton);
            Controls.Add(usernameText);
            Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            ForeColor = Color.White;
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
        private Button customSqlButton;
    }
}