namespace chatjs_gui
{
    partial class loginForm
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
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
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            label1 = new Label();
            label2 = new Label();
            label3 = new Label();
            errorText = new Label();
            usernameInputField = new TextBox();
            passwordInputField = new TextBox();
            loginButton = new Button();
            panel1 = new Panel();
            panel3 = new Panel();
            panel4 = new Panel();
            panel2 = new Panel();
            exitButton = new Button();
            panel5 = new Panel();
            panel1.SuspendLayout();
            panel3.SuspendLayout();
            SuspendLayout();
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Font = new Font("Segoe UI", 20F, FontStyle.Bold);
            label1.ForeColor = Color.White;
            label1.Location = new Point(208, 61);
            label1.Name = "label1";
            label1.Size = new Size(380, 37);
            label1.TabIndex = 0;
            label1.Text = "Login to ChatJs admin panel";
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            label2.ForeColor = Color.White;
            label2.Location = new Point(132, 160);
            label2.Name = "label2";
            label2.Size = new Size(195, 21);
            label2.TabIndex = 1;
            label2.Text = "Email or phone number:";
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            label3.ForeColor = Color.White;
            label3.Location = new Point(241, 223);
            label3.Name = "label3";
            label3.Size = new Size(86, 21);
            label3.TabIndex = 2;
            label3.Text = "Password:";
            // 
            // errorText
            // 
            errorText.AutoSize = true;
            errorText.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            errorText.ForeColor = Color.Red;
            errorText.Location = new Point(261, 279);
            errorText.Name = "errorText";
            errorText.Size = new Size(303, 19);
            errorText.TabIndex = 3;
            errorText.Text = "Incorrect email, phone number or password";
            errorText.Visible = false;
            // 
            // usernameInputField
            // 
            usernameInputField.BackColor = Color.FromArgb(54, 0, 54);
            usernameInputField.BorderStyle = BorderStyle.None;
            usernameInputField.ForeColor = Color.White;
            usernameInputField.Location = new Point(350, 162);
            usernameInputField.Name = "usernameInputField";
            usernameInputField.Size = new Size(254, 16);
            usernameInputField.TabIndex = 4;
            // 
            // passwordInputField
            // 
            passwordInputField.BackColor = Color.FromArgb(54, 0, 54);
            passwordInputField.BorderStyle = BorderStyle.None;
            passwordInputField.ForeColor = Color.White;
            passwordInputField.Location = new Point(350, 221);
            passwordInputField.Name = "passwordInputField";
            passwordInputField.Size = new Size(254, 16);
            passwordInputField.TabIndex = 5;
            passwordInputField.UseSystemPasswordChar = true;
            // 
            // loginButton
            // 
            loginButton.BackColor = Color.FromArgb(64, 0, 64);
            loginButton.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            loginButton.ForeColor = Color.White;
            loginButton.Location = new Point(328, 327);
            loginButton.Name = "loginButton";
            loginButton.Size = new Size(148, 40);
            loginButton.TabIndex = 6;
            loginButton.Text = "Login";
            loginButton.UseVisualStyleBackColor = false;
            loginButton.Click += loginButton_Click;
            // 
            // panel1
            // 
            panel1.BackColor = Color.White;
            panel1.Controls.Add(panel3);
            panel1.Controls.Add(panel2);
            panel1.Location = new Point(350, 179);
            panel1.Name = "panel1";
            panel1.Size = new Size(254, 5);
            panel1.TabIndex = 7;
            // 
            // panel3
            // 
            panel3.BackColor = Color.White;
            panel3.Controls.Add(panel4);
            panel3.Location = new Point(0, 19);
            panel3.Name = "panel3";
            panel3.Size = new Size(254, 5);
            panel3.TabIndex = 9;
            // 
            // panel4
            // 
            panel4.BackColor = Color.White;
            panel4.Location = new Point(0, 63);
            panel4.Name = "panel4";
            panel4.Size = new Size(254, 5);
            panel4.TabIndex = 8;
            // 
            // panel2
            // 
            panel2.BackColor = Color.White;
            panel2.Location = new Point(0, 63);
            panel2.Name = "panel2";
            panel2.Size = new Size(254, 5);
            panel2.TabIndex = 8;
            // 
            // exitButton
            // 
            exitButton.BackColor = Color.Red;
            exitButton.ForeColor = Color.White;
            exitButton.Location = new Point(337, 383);
            exitButton.Name = "exitButton";
            exitButton.Size = new Size(130, 33);
            exitButton.TabIndex = 8;
            exitButton.Text = "Exit";
            exitButton.UseVisualStyleBackColor = false;
            exitButton.Click += exitButton_Click;
            // 
            // panel5
            // 
            panel5.BackColor = Color.White;
            panel5.Location = new Point(350, 239);
            panel5.Name = "panel5";
            panel5.Size = new Size(254, 5);
            panel5.TabIndex = 9;
            // 
            // loginForm
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(54, 0, 54);
            ClientSize = new Size(800, 450);
            Controls.Add(panel5);
            Controls.Add(exitButton);
            Controls.Add(panel1);
            Controls.Add(loginButton);
            Controls.Add(passwordInputField);
            Controls.Add(usernameInputField);
            Controls.Add(errorText);
            Controls.Add(label3);
            Controls.Add(label2);
            Controls.Add(label1);
            Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            ForeColor = Color.FromArgb(64, 0, 64);
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            Name = "loginForm";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "ChatJS Admin Panel";
            Load += loginForm_Load;
            panel1.ResumeLayout(false);
            panel3.ResumeLayout(false);
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label label1;
        private Label label2;
        private Label label3;
        private Label errorText;
        private TextBox usernameInputField;
        private TextBox passwordInputField;
        private Button loginButton;
        private Panel panel1;
        private Button exitButton;
        private Panel panel3;
        private Panel panel4;
        private Panel panel2;
        private Panel panel5;
    }
}
