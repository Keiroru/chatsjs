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
            SuspendLayout();
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Font = new Font("Segoe UI", 20F, FontStyle.Bold);
            label1.ForeColor = Color.White;
            label1.Location = new Point(241, 61);
            label1.Name = "label1";
            label1.Size = new Size(360, 46);
            label1.TabIndex = 0;
            label1.Text = "Login to admin panel";
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            label2.ForeColor = Color.White;
            label2.Location = new Point(104, 157);
            label2.Name = "label2";
            label2.Size = new Size(240, 28);
            label2.TabIndex = 1;
            label2.Text = "Email or phone number:";
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            label3.ForeColor = Color.White;
            label3.Location = new Point(213, 220);
            label3.Name = "label3";
            label3.Size = new Size(106, 28);
            label3.TabIndex = 2;
            label3.Text = "Password:";
            // 
            // errorText
            // 
            errorText.AutoSize = true;
            errorText.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            errorText.ForeColor = Color.Red;
            errorText.Location = new Point(233, 276);
            errorText.Name = "errorText";
            errorText.Size = new Size(361, 23);
            errorText.TabIndex = 3;
            errorText.Text = "Incorrect email, phone number or password";
            errorText.Visible = false;
            // 
            // usernameInputField
            // 
            usernameInputField.Location = new Point(322, 159);
            usernameInputField.Name = "usernameInputField";
            usernameInputField.Size = new Size(254, 27);
            usernameInputField.TabIndex = 4;
            // 
            // passwordInputField
            // 
            passwordInputField.Location = new Point(322, 218);
            passwordInputField.Name = "passwordInputField";
            passwordInputField.Size = new Size(254, 27);
            passwordInputField.TabIndex = 5;
            passwordInputField.UseSystemPasswordChar = true;
            // 
            // loginButton
            // 
            loginButton.BackColor = Color.FromArgb(64, 0, 64);
            loginButton.ForeColor = Color.White;
            loginButton.Location = new Point(309, 331);
            loginButton.Name = "loginButton";
            loginButton.Size = new Size(130, 33);
            loginButton.TabIndex = 6;
            loginButton.Text = "Login";
            loginButton.UseVisualStyleBackColor = false;
            loginButton.Click += loginButton_Click;
            // 
            // loginForm
            // 
            AutoScaleDimensions = new SizeF(9F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(64, 0, 64);
            ClientSize = new Size(800, 450);
            MaximizeBox = false;
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
            Name = "loginForm";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "ChatJS Admin Panel";
            Load += loginForm_Load;
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
    }
}
