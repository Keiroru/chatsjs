using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace chatjs_gui
{
    public partial class ImageViewerForm : Form
    {
        public ImageViewerForm(string imageUrl)
        {
            InitializeComponent();

            PictureBox pictureBox = new PictureBox
            {
                Dock = DockStyle.Fill,
                SizeMode = PictureBoxSizeMode.Zoom
            };

            this.Controls.Add(pictureBox);
            this.Text = "Image Viewer";
            this.Width = 800;
            this.Height = 600;

            try
            {
                using (var webClient = new System.Net.WebClient())
                {
                    var imageBytes = webClient.DownloadData(imageUrl);
                    using (var ms = new MemoryStream(imageBytes))
                    {
                        pictureBox.Image = Image.FromStream(ms);
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Failed to load image:\n" + ex.Message);
            }
        }
    }

}
