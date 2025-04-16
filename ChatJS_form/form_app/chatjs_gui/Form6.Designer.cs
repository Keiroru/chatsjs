namespace chatjs_gui
{
    partial class Form6
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
            usersDataGrid = new DataGridView();
            backButton = new Button();
            pfpButton = new Button();
            noPfpText = new Label();
            textBox = new RichTextBox();
            ((System.ComponentModel.ISupportInitialize)usersDataGrid).BeginInit();
            SuspendLayout();
            // 
            // usersDataGrid
            // 
            usersDataGrid.AllowUserToAddRows = false;
            usersDataGrid.AllowUserToDeleteRows = false;
            usersDataGrid.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            usersDataGrid.Location = new Point(44, 22);
            usersDataGrid.Name = "usersDataGrid";
            usersDataGrid.ReadOnly = true;
            usersDataGrid.Size = new Size(438, 398);
            usersDataGrid.TabIndex = 1;
            usersDataGrid.CellClick += usersDataGrid_CellClick;
            usersDataGrid.CellContentClick += usersDataGrid_CellContentClick;
            // 
            // backButton
            // 
            backButton.BackColor = Color.FromArgb(64, 0, 64);
            backButton.Location = new Point(622, 371);
            backButton.Name = "backButton";
            backButton.Size = new Size(134, 49);
            backButton.TabIndex = 3;
            backButton.Text = "Go Back";
            backButton.UseVisualStyleBackColor = false;
            backButton.Click += backButton_Click;
            // 
            // pfpButton
            // 
            pfpButton.BackColor = Color.FromArgb(255, 128, 0);
            pfpButton.Location = new Point(525, 287);
            pfpButton.Name = "pfpButton";
            pfpButton.Size = new Size(231, 49);
            pfpButton.TabIndex = 4;
            pfpButton.Text = "Look at profile picture";
            pfpButton.UseVisualStyleBackColor = false;
            pfpButton.Click += button1_Click;
            // 
            // noPfpText
            // 
            noPfpText.AutoSize = true;
            noPfpText.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            noPfpText.ForeColor = Color.Red;
            noPfpText.Location = new Point(525, 245);
            noPfpText.Name = "noPfpText";
            noPfpText.Size = new Size(151, 21);
            noPfpText.TabIndex = 5;
            noPfpText.Text = "No profile picture!";
            noPfpText.Visible = false;
            // 
            // textBox
            // 
            textBox.Location = new Point(508, 22);
            textBox.Margin = new Padding(3, 2, 3, 2);
            textBox.Name = "textBox";
            textBox.ReadOnly = true;
            textBox.Size = new Size(265, 207);
            textBox.TabIndex = 13;
            textBox.Text = "";
            // 
            // Form6
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(64, 64, 64);
            ClientSize = new Size(800, 450);
            Controls.Add(textBox);
            Controls.Add(noPfpText);
            Controls.Add(pfpButton);
            Controls.Add(backButton);
            Controls.Add(usersDataGrid);
            Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            ForeColor = Color.White;
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            Name = "Form6";
            StartPosition = FormStartPosition.CenterParent;
            Text = "User Details";
            ((System.ComponentModel.ISupportInitialize)usersDataGrid).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private DataGridView usersDataGrid;
        private Button backButton;
        private Button pfpButton;
        private Label noPfpText;
        private RichTextBox textBox;
    }
}