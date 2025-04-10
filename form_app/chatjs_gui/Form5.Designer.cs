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
            groupBox1 = new GroupBox();
            closedTicketsRadioButton = new RadioButton();
            openTicketsRadioButton = new RadioButton();
            doneButton = new Button();
            titleText = new Label();
            descriptionText = new RichTextBox();
            backButton = new Button();
            reportsDataGrid = new DataGridView();
            displayName = new DataGridViewTextBoxColumn();
            displayId = new DataGridViewTextBoxColumn();
            bugReportName = new DataGridViewTextBoxColumn();
            bugReportId = new DataGridViewTextBoxColumn();
            groupBox1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)reportsDataGrid).BeginInit();
            SuspendLayout();
            // 
            // refreshButton
            // 
            refreshButton.BackColor = Color.FromArgb(0, 0, 64);
            refreshButton.Location = new Point(483, 440);
            refreshButton.Name = "refreshButton";
            refreshButton.Size = new Size(97, 49);
            refreshButton.TabIndex = 16;
            refreshButton.Text = "Refresh";
            refreshButton.UseVisualStyleBackColor = false;
            // 
            // groupBox1
            // 
            groupBox1.Controls.Add(closedTicketsRadioButton);
            groupBox1.Controls.Add(openTicketsRadioButton);
            groupBox1.Location = new Point(243, 410);
            groupBox1.Name = "groupBox1";
            groupBox1.Size = new Size(220, 88);
            groupBox1.TabIndex = 15;
            groupBox1.TabStop = false;
            // 
            // closedTicketsRadioButton
            // 
            closedTicketsRadioButton.AutoSize = true;
            closedTicketsRadioButton.Location = new Point(17, 54);
            closedTicketsRadioButton.Name = "closedTicketsRadioButton";
            closedTicketsRadioButton.Size = new Size(159, 24);
            closedTicketsRadioButton.TabIndex = 8;
            closedTicketsRadioButton.Text = "Show closed tickets";
            closedTicketsRadioButton.UseVisualStyleBackColor = true;
            // 
            // openTicketsRadioButton
            // 
            openTicketsRadioButton.AutoSize = true;
            openTicketsRadioButton.Checked = true;
            openTicketsRadioButton.Location = new Point(17, 22);
            openTicketsRadioButton.Name = "openTicketsRadioButton";
            openTicketsRadioButton.Size = new Size(150, 24);
            openTicketsRadioButton.TabIndex = 7;
            openTicketsRadioButton.TabStop = true;
            openTicketsRadioButton.Text = "Show open tickets";
            openTicketsRadioButton.UseVisualStyleBackColor = true;
            // 
            // doneButton
            // 
            doneButton.BackColor = Color.Green;
            doneButton.Location = new Point(805, 440);
            doneButton.Name = "doneButton";
            doneButton.Size = new Size(134, 49);
            doneButton.TabIndex = 14;
            doneButton.Text = "Mark as done";
            doneButton.UseVisualStyleBackColor = false;
            doneButton.Visible = false;
            // 
            // titleText
            // 
            titleText.Font = new Font("Segoe UI", 14F, FontStyle.Bold);
            titleText.Location = new Point(649, 53);
            titleText.Name = "titleText";
            titleText.Size = new Size(434, 64);
            titleText.TabIndex = 13;
            titleText.Text = "title";
            titleText.TextAlign = ContentAlignment.MiddleCenter;
            titleText.Visible = false;
            // 
            // descriptionText
            // 
            descriptionText.Enabled = false;
            descriptionText.Location = new Point(649, 120);
            descriptionText.Name = "descriptionText";
            descriptionText.Size = new Size(434, 275);
            descriptionText.TabIndex = 12;
            descriptionText.Text = "";
            // 
            // backButton
            // 
            backButton.BackColor = Color.FromArgb(64, 0, 64);
            backButton.Location = new Point(36, 440);
            backButton.Name = "backButton";
            backButton.Size = new Size(134, 49);
            backButton.TabIndex = 11;
            backButton.Text = "Go Back";
            backButton.UseVisualStyleBackColor = false;
            // 
            // reportsDataGrid
            // 
            reportsDataGrid.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            reportsDataGrid.Columns.AddRange(new DataGridViewColumn[] { displayName, displayId, bugReportName, bugReportId });
            reportsDataGrid.Location = new Point(36, 45);
            reportsDataGrid.Name = "reportsDataGrid";
            reportsDataGrid.RowHeadersWidth = 51;
            reportsDataGrid.Size = new Size(563, 350);
            reportsDataGrid.TabIndex = 10;
            // 
            // displayName
            // 
            displayName.HeaderText = "Display Name";
            displayName.MinimumWidth = 6;
            displayName.Name = "displayName";
            displayName.Width = 200;
            // 
            // displayId
            // 
            displayId.HeaderText = "Display ID";
            displayId.MinimumWidth = 6;
            displayId.Name = "displayId";
            displayId.Width = 60;
            // 
            // bugReportName
            // 
            bugReportName.HeaderText = "Bug Report Name";
            bugReportName.MinimumWidth = 6;
            bugReportName.Name = "bugReportName";
            bugReportName.Width = 200;
            // 
            // bugReportId
            // 
            bugReportId.HeaderText = "ID";
            bugReportId.MinimumWidth = 6;
            bugReportId.Name = "bugReportId";
            bugReportId.Width = 60;
            // 
            // Form5
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(64, 64, 64);
            ClientSize = new Size(1128, 561);
            Controls.Add(refreshButton);
            Controls.Add(groupBox1);
            Controls.Add(doneButton);
            Controls.Add(titleText);
            Controls.Add(descriptionText);
            Controls.Add(backButton);
            Controls.Add(reportsDataGrid);
            Margin = new Padding(3, 4, 3, 4);
            Name = "Form5";
            Text = "Form5";
            groupBox1.ResumeLayout(false);
            groupBox1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)reportsDataGrid).EndInit();
            ResumeLayout(false);
        }

        #endregion

        private Button refreshButton;
        private GroupBox groupBox1;
        private RadioButton closedTicketsRadioButton;
        private RadioButton openTicketsRadioButton;
        private Button doneButton;
        private Label titleText;
        private RichTextBox descriptionText;
        private Button backButton;
        private DataGridView reportsDataGrid;
        private DataGridViewTextBoxColumn displayName;
        private DataGridViewTextBoxColumn displayId;
        private DataGridViewTextBoxColumn bugReportName;
        private DataGridViewTextBoxColumn bugReportId;
    }
}