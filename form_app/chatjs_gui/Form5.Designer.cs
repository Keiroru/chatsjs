namespace chatjs_gui
{
    partial class Form5
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
            refreshButton = new Button();
            closeReportButton = new Button();
            messageText = new RichTextBox();
            backButton = new Button();
            reportsDataGrid = new DataGridView();
            displayName = new DataGridViewTextBoxColumn();
            displayId = new DataGridViewTextBoxColumn();
            reportedMessageId = new DataGridViewTextBoxColumn();
            dateText = new Label();
            banUserButton = new Button();
            deleteMessageButton = new Button();
            ((System.ComponentModel.ISupportInitialize)reportsDataGrid).BeginInit();
            SuspendLayout();
            // 
            // refreshButton
            // 
            refreshButton.BackColor = Color.FromArgb(0, 0, 64);
            refreshButton.Location = new Point(304, 330);
            refreshButton.Margin = new Padding(3, 2, 3, 2);
            refreshButton.Name = "refreshButton";
            refreshButton.Size = new Size(101, 50);
            refreshButton.TabIndex = 16;
            refreshButton.Text = "Refresh";
            refreshButton.UseVisualStyleBackColor = false;
            refreshButton.Click += refreshButton_Click;
            // 
            // closeReportButton
            // 
            closeReportButton.BackColor = Color.Green;
            closeReportButton.Location = new Point(704, 330);
            closeReportButton.Margin = new Padding(3, 2, 3, 2);
            closeReportButton.Name = "closeReportButton";
            closeReportButton.Size = new Size(117, 37);
            closeReportButton.TabIndex = 14;
            closeReportButton.Text = "Close Report";
            closeReportButton.UseVisualStyleBackColor = false;
            closeReportButton.Visible = false;
            closeReportButton.Click += closeReportButton_Click;
            // 
            // messageText
            // 
            messageText.Location = new Point(441, 34);
            messageText.Margin = new Padding(3, 2, 3, 2);
            messageText.Name = "messageText";
            messageText.ReadOnly = true;
            messageText.Size = new Size(380, 207);
            messageText.TabIndex = 12;
            messageText.Text = "";
            // 
            // backButton
            // 
            backButton.BackColor = Color.FromArgb(64, 0, 64);
            backButton.Location = new Point(32, 330);
            backButton.Margin = new Padding(3, 2, 3, 2);
            backButton.Name = "backButton";
            backButton.Size = new Size(114, 50);
            backButton.TabIndex = 11;
            backButton.Text = "Go Back";
            backButton.UseVisualStyleBackColor = false;
            backButton.Click += backButton_Click;
            // 
            // reportsDataGrid
            // 
            reportsDataGrid.AllowUserToAddRows = false;
            reportsDataGrid.AllowUserToDeleteRows = false;
            reportsDataGrid.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            reportsDataGrid.Columns.AddRange(new DataGridViewColumn[] { displayName, displayId, reportedMessageId });
            reportsDataGrid.Location = new Point(32, 34);
            reportsDataGrid.Margin = new Padding(3, 2, 3, 2);
            reportsDataGrid.Name = "reportsDataGrid";
            reportsDataGrid.ReadOnly = true;
            reportsDataGrid.RowHeadersWidth = 51;
            reportsDataGrid.Size = new Size(373, 262);
            reportsDataGrid.TabIndex = 10;
            reportsDataGrid.CellClick += reportsDataGrid_CellClick;
            reportsDataGrid.CellContentClick += reportsDataGrid_CellContentClick;
            // 
            // displayName
            // 
            displayName.HeaderText = "Display Name";
            displayName.MinimumWidth = 6;
            displayName.Name = "displayName";
            displayName.ReadOnly = true;
            displayName.Width = 200;
            // 
            // displayId
            // 
            displayId.HeaderText = "Display ID";
            displayId.MinimumWidth = 6;
            displayId.Name = "displayId";
            displayId.ReadOnly = true;
            displayId.Width = 60;
            // 
            // reportedMessageId
            // 
            reportedMessageId.HeaderText = "ID";
            reportedMessageId.MinimumWidth = 6;
            reportedMessageId.Name = "reportedMessageId";
            reportedMessageId.ReadOnly = true;
            reportedMessageId.Width = 60;
            // 
            // dateText
            // 
            dateText.AutoSize = true;
            dateText.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            dateText.Location = new Point(441, 275);
            dateText.Name = "dateText";
            dateText.Size = new Size(57, 21);
            dateText.TabIndex = 17;
            dateText.Text = "label1";
            dateText.Visible = false;
            // 
            // banUserButton
            // 
            banUserButton.BackColor = Color.Red;
            banUserButton.Location = new Point(573, 330);
            banUserButton.Margin = new Padding(3, 2, 3, 2);
            banUserButton.Name = "banUserButton";
            banUserButton.Size = new Size(117, 37);
            banUserButton.TabIndex = 18;
            banUserButton.Text = "Ban User";
            banUserButton.UseVisualStyleBackColor = false;
            banUserButton.Visible = false;
            banUserButton.Click += banUserButton_Click;
            // 
            // deleteMessageButton
            // 
            deleteMessageButton.BackColor = Color.FromArgb(255, 128, 0);
            deleteMessageButton.Location = new Point(441, 330);
            deleteMessageButton.Margin = new Padding(3, 2, 3, 2);
            deleteMessageButton.Name = "deleteMessageButton";
            deleteMessageButton.Size = new Size(117, 37);
            deleteMessageButton.TabIndex = 19;
            deleteMessageButton.Text = "Delete Message";
            deleteMessageButton.UseVisualStyleBackColor = false;
            deleteMessageButton.Visible = false;
            deleteMessageButton.Click += deleteMessageButton_Click;
            // 
            // Form5
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(64, 64, 64);
            ClientSize = new Size(847, 421);
            Controls.Add(deleteMessageButton);
            Controls.Add(banUserButton);
            Controls.Add(dateText);
            Controls.Add(refreshButton);
            Controls.Add(closeReportButton);
            Controls.Add(messageText);
            Controls.Add(backButton);
            Controls.Add(reportsDataGrid);
            Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            ForeColor = Color.White;
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            Name = "Form5";
            StartPosition = FormStartPosition.CenterParent;
            Text = "Reported Messages";
            ((System.ComponentModel.ISupportInitialize)reportsDataGrid).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Button refreshButton;
        private Button closeReportButton;
        private RichTextBox messageText;
        private Button backButton;
        private DataGridView reportsDataGrid;
        private Label dateText;
        private Button banUserButton;
        private Button deleteMessageButton;
        private DataGridViewTextBoxColumn displayName;
        private DataGridViewTextBoxColumn displayId;
        private DataGridViewTextBoxColumn reportedMessageId;
    }
}