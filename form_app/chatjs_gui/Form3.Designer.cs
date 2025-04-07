namespace chatjs_gui
{
    partial class Form3
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
            DataGridViewCellStyle dataGridViewCellStyle1 = new DataGridViewCellStyle();
            usersDataGrid = new DataGridView();
            displayName = new DataGridViewTextBoxColumn();
            displayId = new DataGridViewTextBoxColumn();
            email = new DataGridViewTextBoxColumn();
            phoneNumber = new DataGridViewTextBoxColumn();
            isSiteAdmin = new DataGridViewTextBoxColumn();
            isBanned = new DataGridViewTextBoxColumn();
            backButton = new Button();
            controlsGroupBox = new GroupBox();
            banButton = new Button();
            siteAdminButton = new Button();
            label1 = new Label();
            label2 = new Label();
            nameInputField = new TextBox();
            idInputField = new TextBox();
            ((System.ComponentModel.ISupportInitialize)usersDataGrid).BeginInit();
            controlsGroupBox.SuspendLayout();
            SuspendLayout();
            // 
            // usersDataGrid
            // 
            usersDataGrid.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            usersDataGrid.Columns.AddRange(new DataGridViewColumn[] { displayName, displayId, email, phoneNumber, isSiteAdmin, isBanned });
            dataGridViewCellStyle1.Alignment = DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle1.BackColor = SystemColors.Window;
            dataGridViewCellStyle1.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            dataGridViewCellStyle1.ForeColor = Color.White;
            dataGridViewCellStyle1.SelectionBackColor = SystemColors.Highlight;
            dataGridViewCellStyle1.SelectionForeColor = SystemColors.HighlightText;
            dataGridViewCellStyle1.WrapMode = DataGridViewTriState.False;
            usersDataGrid.DefaultCellStyle = dataGridViewCellStyle1;
            usersDataGrid.Location = new Point(28, 59);
            usersDataGrid.Name = "usersDataGrid";
            usersDataGrid.Size = new Size(746, 251);
            usersDataGrid.TabIndex = 0;
            usersDataGrid.CellClick += usersDataGrid_CellClick;
            usersDataGrid.CellContentClick += usersDataGrid_CellContentClick;
            // 
            // displayName
            // 
            displayName.HeaderText = "Display Name";
            displayName.Name = "displayName";
            displayName.Width = 200;
            // 
            // displayId
            // 
            displayId.HeaderText = "Display ID";
            displayId.Name = "displayId";
            displayId.Width = 60;
            // 
            // email
            // 
            email.HeaderText = "Email";
            email.Name = "email";
            email.Width = 200;
            // 
            // phoneNumber
            // 
            phoneNumber.HeaderText = "Phone Number";
            phoneNumber.Name = "phoneNumber";
            phoneNumber.Width = 120;
            // 
            // isSiteAdmin
            // 
            isSiteAdmin.HeaderText = "Is Site Admin";
            isSiteAdmin.Name = "isSiteAdmin";
            isSiteAdmin.Width = 60;
            // 
            // isBanned
            // 
            isBanned.HeaderText = "Is Banned";
            isBanned.Name = "isBanned";
            isBanned.Width = 60;
            // 
            // backButton
            // 
            backButton.BackColor = Color.FromArgb(64, 0, 64);
            backButton.Location = new Point(28, 358);
            backButton.Name = "backButton";
            backButton.Size = new Size(134, 49);
            backButton.TabIndex = 2;
            backButton.Text = "Go Back";
            backButton.UseVisualStyleBackColor = false;
            backButton.Click += backButton_Click;
            // 
            // controlsGroupBox
            // 
            controlsGroupBox.Controls.Add(banButton);
            controlsGroupBox.Controls.Add(siteAdminButton);
            controlsGroupBox.Location = new Point(242, 328);
            controlsGroupBox.Name = "controlsGroupBox";
            controlsGroupBox.Size = new Size(532, 100);
            controlsGroupBox.TabIndex = 3;
            controlsGroupBox.TabStop = false;
            controlsGroupBox.Text = "User Controls";
            controlsGroupBox.Visible = false;
            // 
            // banButton
            // 
            banButton.BackColor = Color.Navy;
            banButton.Location = new Point(344, 30);
            banButton.Name = "banButton";
            banButton.Size = new Size(134, 49);
            banButton.TabIndex = 9;
            banButton.Text = "Ban user";
            banButton.UseVisualStyleBackColor = false;
            banButton.Click += banButton_Click;
            // 
            // siteAdminButton
            // 
            siteAdminButton.BackColor = Color.Navy;
            siteAdminButton.Location = new Point(56, 30);
            siteAdminButton.Name = "siteAdminButton";
            siteAdminButton.Size = new Size(134, 49);
            siteAdminButton.TabIndex = 8;
            siteAdminButton.Text = "Make site admin";
            siteAdminButton.UseVisualStyleBackColor = false;
            siteAdminButton.Click += siteAdminButton_Click;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            label1.Location = new Point(63, 23);
            label1.Name = "label1";
            label1.Size = new Size(209, 21);
            label1.TabIndex = 4;
            label1.Text = "Search someone by name:";
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            label2.Location = new Point(519, 23);
            label2.Name = "label2";
            label2.Size = new Size(95, 21);
            label2.TabIndex = 5;
            label2.Text = "and / or ID:";
            // 
            // nameInputField
            // 
            nameInputField.Location = new Point(278, 23);
            nameInputField.MaxLength = 20;
            nameInputField.Name = "nameInputField";
            nameInputField.Size = new Size(222, 23);
            nameInputField.TabIndex = 6;
            // 
            // idInputField
            // 
            idInputField.Location = new Point(620, 25);
            idInputField.MaxLength = 4;
            idInputField.Name = "idInputField";
            idInputField.Size = new Size(100, 23);
            idInputField.TabIndex = 7;
            idInputField.TextChanged += idInputField_TextChanged;
            // 
            // Form3
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(64, 64, 64);
            ClientSize = new Size(800, 450);
            Controls.Add(idInputField);
            Controls.Add(nameInputField);
            Controls.Add(label2);
            Controls.Add(label1);
            Controls.Add(controlsGroupBox);
            Controls.Add(backButton);
            Controls.Add(usersDataGrid);
            Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            ForeColor = Color.White;
            Name = "Form3";
            StartPosition = FormStartPosition.CenterParent;
            Text = "Users Panel";
            ((System.ComponentModel.ISupportInitialize)usersDataGrid).EndInit();
            controlsGroupBox.ResumeLayout(false);
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private DataGridView usersDataGrid;
        private Button backButton;
        private GroupBox controlsGroupBox;
        private Label label1;
        private Label label2;
        private TextBox nameInputField;
        private TextBox idInputField;
        private DataGridViewTextBoxColumn displayName;
        private DataGridViewTextBoxColumn displayId;
        private DataGridViewTextBoxColumn email;
        private DataGridViewTextBoxColumn phoneNumber;
        private DataGridViewTextBoxColumn isSiteAdmin;
        private DataGridViewTextBoxColumn isBanned;
        private Button banButton;
        private Button siteAdminButton;
    }
}