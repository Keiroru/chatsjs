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
            dataGridView1 = new DataGridView();
            displayName = new DataGridViewTextBoxColumn();
            displayId = new DataGridViewTextBoxColumn();
            bugReportName = new DataGridViewTextBoxColumn();
            backButton = new Button();
            descriptionText = new RichTextBox();
            label1 = new Label();
            button1 = new Button();
            radioButton1 = new RadioButton();
            groupBox1 = new GroupBox();
            radioButton2 = new RadioButton();
            ((System.ComponentModel.ISupportInitialize)dataGridView1).BeginInit();
            groupBox1.SuspendLayout();
            SuspendLayout();
            // 
            // dataGridView1
            // 
            dataGridView1.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            dataGridView1.Columns.AddRange(new DataGridViewColumn[] { displayName, displayId, bugReportName });
            dataGridView1.Location = new Point(23, 22);
            dataGridView1.Name = "dataGridView1";
            dataGridView1.Size = new Size(504, 350);
            dataGridView1.TabIndex = 0;
            dataGridView1.CellContentClick += dataGridView1_CellContentClick;
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
            // bugReportName
            // 
            bugReportName.HeaderText = "Bug Report Name";
            bugReportName.Name = "bugReportName";
            bugReportName.Width = 200;
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
            descriptionText.Enabled = false;
            descriptionText.Location = new Point(608, 97);
            descriptionText.Name = "descriptionText";
            descriptionText.Size = new Size(462, 275);
            descriptionText.TabIndex = 4;
            descriptionText.Text = "";
            // 
            // label1
            // 
            label1.Font = new Font("Segoe UI", 14F, FontStyle.Bold);
            label1.Location = new Point(608, 30);
            label1.Name = "label1";
            label1.Size = new Size(462, 64);
            label1.TabIndex = 5;
            label1.Text = "title";
            label1.TextAlign = ContentAlignment.MiddleCenter;
            label1.Visible = false;
            // 
            // button1
            // 
            button1.BackColor = Color.Green;
            button1.Location = new Point(773, 417);
            button1.Name = "button1";
            button1.Size = new Size(134, 49);
            button1.TabIndex = 6;
            button1.Text = "Mark as done";
            button1.UseVisualStyleBackColor = false;
            // 
            // radioButton1
            // 
            radioButton1.AutoSize = true;
            radioButton1.Location = new Point(17, 22);
            radioButton1.Name = "radioButton1";
            radioButton1.Size = new Size(128, 19);
            radioButton1.TabIndex = 7;
            radioButton1.TabStop = true;
            radioButton1.Text = "Show open tickets";
            radioButton1.UseVisualStyleBackColor = true;
            radioButton1.CheckedChanged += radioButton1_CheckedChanged;
            // 
            // groupBox1
            // 
            groupBox1.Controls.Add(radioButton2);
            groupBox1.Controls.Add(radioButton1);
            groupBox1.Location = new Point(307, 378);
            groupBox1.Name = "groupBox1";
            groupBox1.Size = new Size(220, 88);
            groupBox1.TabIndex = 8;
            groupBox1.TabStop = false;
            // 
            // radioButton2
            // 
            radioButton2.AutoSize = true;
            radioButton2.Location = new Point(17, 54);
            radioButton2.Name = "radioButton2";
            radioButton2.Size = new Size(135, 19);
            radioButton2.TabIndex = 8;
            radioButton2.TabStop = true;
            radioButton2.Text = "Show closed tickets";
            radioButton2.UseVisualStyleBackColor = true;
            // 
            // Form4
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(64, 64, 64);
            ClientSize = new Size(1121, 501);
            Controls.Add(groupBox1);
            Controls.Add(button1);
            Controls.Add(label1);
            Controls.Add(descriptionText);
            Controls.Add(backButton);
            Controls.Add(dataGridView1);
            Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            ForeColor = Color.White;
            Name = "Form4";
            Text = "Form4";
            ((System.ComponentModel.ISupportInitialize)dataGridView1).EndInit();
            groupBox1.ResumeLayout(false);
            groupBox1.PerformLayout();
            ResumeLayout(false);
        }

        #endregion

        private DataGridView dataGridView1;
        private DataGridViewTextBoxColumn displayName;
        private DataGridViewTextBoxColumn displayId;
        private DataGridViewTextBoxColumn bugReportName;
        private Button backButton;
        private RichTextBox descriptionText;
        private Label label1;
        private Button button1;
        private RadioButton radioButton1;
        private GroupBox groupBox1;
        private RadioButton radioButton2;
    }
}