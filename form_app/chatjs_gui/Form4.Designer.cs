namespace chatjs_gui
{
    partial class Form4
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
            reportsDataGrid = new DataGridView();
            displayName = new DataGridViewTextBoxColumn();
            displayId = new DataGridViewTextBoxColumn();
            bugReportName = new DataGridViewTextBoxColumn();
            bugReportId = new DataGridViewTextBoxColumn();
            backButton = new Button();
            descriptionText = new RichTextBox();
            titleText = new Label();
            doneButton = new Button();
            openTicketsRadioButton = new RadioButton();
            groupBox1 = new GroupBox();
            closedTicketsRadioButton = new RadioButton();
            refreshButton = new Button();
            openImageButton = new Button();
            ((System.ComponentModel.ISupportInitialize)reportsDataGrid).BeginInit();
            groupBox1.SuspendLayout();
            SuspendLayout();
            // 
            // reportsDataGrid
            // 
            reportsDataGrid.AllowUserToAddRows = false;
            reportsDataGrid.AllowUserToDeleteRows = false;
            reportsDataGrid.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            reportsDataGrid.Columns.AddRange(new DataGridViewColumn[] { displayName, displayId, bugReportName, bugReportId });
            reportsDataGrid.Location = new Point(23, 22);
            reportsDataGrid.Name = "reportsDataGrid";
            reportsDataGrid.ReadOnly = true;
            reportsDataGrid.Size = new Size(563, 350);
            reportsDataGrid.TabIndex = 0;
            reportsDataGrid.CellClick += reportsDataGrid_CellClick;
            reportsDataGrid.CellContentClick += reportsDataGrid_CellContentClick;
            // 
            // displayName
            // 
            displayName.HeaderText = "Display Name";
            displayName.Name = "displayName";
            displayName.ReadOnly = true;
            displayName.Width = 200;
            // 
            // displayId
            // 
            displayId.HeaderText = "Display ID";
            displayId.Name = "displayId";
            displayId.ReadOnly = true;
            displayId.Width = 60;
            // 
            // bugReportName
            // 
            bugReportName.HeaderText = "Bug Report Name";
            bugReportName.Name = "bugReportName";
            bugReportName.ReadOnly = true;
            bugReportName.Width = 200;
            // 
            // bugReportId
            // 
            bugReportId.HeaderText = "ID";
            bugReportId.Name = "bugReportId";
            bugReportId.ReadOnly = true;
            bugReportId.Width = 60;
            // 
            // backButton
            // 
            backButton.BackColor = Color.FromArgb(64, 0, 64);
            backButton.Location = new Point(23, 417);
            backButton.Name = "backButton";
            backButton.Size = new Size(134, 49);
            backButton.TabIndex = 3;
            backButton.Text = "Go Back";
            backButton.UseVisualStyleBackColor = false;
            backButton.Click += backButton_Click;
            // 
            // descriptionText
            // 
            descriptionText.Location = new Point(636, 97);
            descriptionText.Name = "descriptionText";
            descriptionText.ReadOnly = true;
            descriptionText.Size = new Size(434, 275);
            descriptionText.TabIndex = 4;
            descriptionText.Text = "";
            // 
            // titleText
            // 
            titleText.Font = new Font("Segoe UI", 14F, FontStyle.Bold);
            titleText.Location = new Point(636, 30);
            titleText.Name = "titleText";
            titleText.Size = new Size(434, 64);
            titleText.TabIndex = 5;
            titleText.Text = "title";
            titleText.TextAlign = ContentAlignment.MiddleCenter;
            titleText.Visible = false;
            // 
            // doneButton
            // 
            doneButton.BackColor = Color.Green;
            doneButton.Location = new Point(636, 417);
            doneButton.Name = "doneButton";
            doneButton.Size = new Size(134, 49);
            doneButton.TabIndex = 6;
            doneButton.Text = "Mark as done";
            doneButton.UseVisualStyleBackColor = false;
            doneButton.Visible = false;
            doneButton.Click += doneButton_Click;
            // 
            // openTicketsRadioButton
            // 
            openTicketsRadioButton.AutoSize = true;
            openTicketsRadioButton.Checked = true;
            openTicketsRadioButton.Location = new Point(17, 22);
            openTicketsRadioButton.Name = "openTicketsRadioButton";
            openTicketsRadioButton.Size = new Size(128, 19);
            openTicketsRadioButton.TabIndex = 7;
            openTicketsRadioButton.TabStop = true;
            openTicketsRadioButton.Text = "Show open tickets";
            openTicketsRadioButton.UseVisualStyleBackColor = true;
            openTicketsRadioButton.CheckedChanged += openTicketsRadioButton_CheckedChanged;
            // 
            // groupBox1
            // 
            groupBox1.Controls.Add(closedTicketsRadioButton);
            groupBox1.Controls.Add(openTicketsRadioButton);
            groupBox1.Location = new Point(230, 387);
            groupBox1.Name = "groupBox1";
            groupBox1.Size = new Size(220, 88);
            groupBox1.TabIndex = 8;
            groupBox1.TabStop = false;
            // 
            // closedTicketsRadioButton
            // 
            closedTicketsRadioButton.AutoSize = true;
            closedTicketsRadioButton.Location = new Point(17, 54);
            closedTicketsRadioButton.Name = "closedTicketsRadioButton";
            closedTicketsRadioButton.Size = new Size(135, 19);
            closedTicketsRadioButton.TabIndex = 8;
            closedTicketsRadioButton.Text = "Show closed tickets";
            closedTicketsRadioButton.UseVisualStyleBackColor = true;
            closedTicketsRadioButton.CheckedChanged += closedTicketsRadioButton_CheckedChanged;
            // 
            // refreshButton
            // 
            refreshButton.BackColor = Color.FromArgb(0, 0, 64);
            refreshButton.Location = new Point(470, 417);
            refreshButton.Name = "refreshButton";
            refreshButton.Size = new Size(97, 49);
            refreshButton.TabIndex = 9;
            refreshButton.Text = "Refresh";
            refreshButton.UseVisualStyleBackColor = false;
            refreshButton.Click += refreshButton_Click;
            // 
            // openImageButton
            // 
            openImageButton.BackColor = Color.FromArgb(255, 128, 0);
            openImageButton.Location = new Point(953, 387);
            openImageButton.Margin = new Padding(3, 2, 3, 2);
            openImageButton.Name = "openImageButton";
            openImageButton.Size = new Size(117, 37);
            openImageButton.TabIndex = 20;
            openImageButton.Text = "Open Image";
            openImageButton.UseVisualStyleBackColor = false;
            openImageButton.Visible = false;
            openImageButton.Click += openImageButton_Click;
            // 
            // Form4
            // 
            AutoScaleMode = AutoScaleMode.None;
            BackColor = Color.FromArgb(64, 64, 64);
            ClientSize = new Size(1121, 501);
            Controls.Add(openImageButton);
            Controls.Add(refreshButton);
            Controls.Add(groupBox1);
            Controls.Add(doneButton);
            Controls.Add(titleText);
            Controls.Add(descriptionText);
            Controls.Add(backButton);
            Controls.Add(reportsDataGrid);
            Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            ForeColor = Color.White;
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            Name = "Form4";
            StartPosition = FormStartPosition.CenterParent;
            Text = "Reported Bugs";
            ((System.ComponentModel.ISupportInitialize)reportsDataGrid).EndInit();
            groupBox1.ResumeLayout(false);
            groupBox1.PerformLayout();
            ResumeLayout(false);
        }

        #endregion

        private DataGridView reportsDataGrid;
        private Button backButton;
        private RichTextBox descriptionText;
        private Label titleText;
        private Button doneButton;
        private RadioButton openTicketsRadioButton;
        private GroupBox groupBox1;
        private RadioButton closedTicketsRadioButton;
        private DataGridViewTextBoxColumn displayName;
        private DataGridViewTextBoxColumn displayId;
        private DataGridViewTextBoxColumn bugReportName;
        private DataGridViewTextBoxColumn bugReportId;
        private Button refreshButton;
        private Button openImageButton;
    }
}