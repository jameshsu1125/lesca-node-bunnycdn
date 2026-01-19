const createApp = () => {
  return new Promise<HTMLElement>((resolve) => {
    const app = document.createElement('div');
    const button = document.createElement('button');
    const button2 = document.createElement('button');
    const upload = document.createElement('input');
    upload.type = 'file';
    upload.id = 'fileInput';

    let files: any[] = [];

    app.appendChild(upload);
    app.appendChild(button);
    app.appendChild(button2);
    button.textContent = 'Upload';
    button2.textContent = 'delete first file';

    button.addEventListener('click', () => {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput.files!.length === 0) {
        alert('Please select a file.');
        return;
      }
      const formData = new FormData();
      formData.append('file', fileInput.files![0]);
      fetch('http://localhost:3000/upload', { method: 'POST', body: formData })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result.res) {
            alert('Upload successful! URL: ' + result.url);
          } else {
            alert('Upload failed: ' + result.error);
          }
        })
        .catch((error) => {
          console.error('Network error:', error);
          alert(
            'Upload failed: Unable to connect to server. Please make sure the server is running on http://localhost:3000',
          );
        });
    });

    button2.addEventListener('click', () => {
      console.log(files);
      return;
      const [firstFile] = files;
      if (firstFile) {
        fetch('http://localhost:3000/delete', {
          method: 'POST',
          body: JSON.stringify({ filename: firstFile.FileName }),
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.success) {
              alert('Delete successful!');
            }
          });
      }
    });

    fetch('http://localhost:3000/list', { method: 'GET' })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        if (result.res) {
          files = result.files;
          result.files.forEach((file: any) => {
            console.log(file);
          });
        } else {
          console.error('Failed to fetch file list:', result.error);
        }
      })
      .catch((error) => {
        console.error('Network error:', error);
      });

    resolve(app);
  });
};

export default createApp;

const appElement = document.getElementById('app');
if (appElement && appElement.children.length === 0) {
  createApp().then((app) => {
    appElement.appendChild(app);
  });
}
