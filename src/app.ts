const images: string[] = [];

const createApp = () => {
  return new Promise<HTMLElement>((resolve) => {
    const app = document.createElement('div');

    const onRemoveClick = (e: MouseEvent) => {
      const button = e.currentTarget as HTMLDivElement;
      fetch('http://localhost:3000/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ href: button.dataset.url }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.res) {
            images.splice(images.indexOf(button.dataset.url!), 1);
            updateImageList();
            alert('Delete successful!');
          } else {
            console.error('Delete failed: ' + result.message);
          }
        });
    };

    const updateImageList = () => {
      const imageList = document.getElementById('file-list') as HTMLDivElement;
      imageList.innerHTML = '';
      images
        .filter((url) => url.match(/\.(webp|png|jpe?g)$/i))
        .forEach((url) => {
          const avatar = document.createElement('div');
          avatar.className = 'avatar relative';
          const wDiv = document.createElement('div');
          wDiv.className = 'w-24 rounded';
          const img = document.createElement('img');
          img.src = url;
          wDiv.appendChild(img);
          avatar.appendChild(wDiv);
          imageList.appendChild(avatar);

          // remove button
          const removeBtn = document.createElement('div');
          removeBtn.className =
            'absolute w-full h-full top-0 left-0 bg-black opacity-0 hover:opacity-50 flex justify-center items-center text-white text-2xl cursor-pointer font-mono';
          removeBtn.innerText = 'X';
          removeBtn.dataset.url = url;
          removeBtn.addEventListener('click', onRemoveClick);
          avatar.appendChild(removeBtn);
        });
    };

    // upload
    const upload = document.getElementById('upload') as HTMLButtonElement;
    upload?.addEventListener('click', () => {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput.files!.length === 0) {
        alert('Please select a file.');
        return;
      }
      const formData = new FormData();
      formData.append('file', fileInput.files![0]);
      fetch('http://localhost:3000/upload', { method: 'POST', body: formData })
        .then((response) => response.json())
        .then((result) => {
          if (result.res) {
            images.push(result.url);
            updateImageList();
          } else console.error('Upload failed: ' + result.error);
        })
        .catch((error) => console.error('Network error:', error));
    });

    // list
    const list = document.getElementById('list') as HTMLButtonElement;
    list?.addEventListener('click', () => {
      images.length = 0;
      fetch('http://localhost:3000/list', { method: 'GET' })
        .then((response) => response.json())
        .then((result) => {
          if (result.res) {
            result.files.forEach((file: any) => {
              const url = file.Url;
              images.push(url);
            });
            updateImageList();
          } else {
            console.error('Failed to fetch file list:', result.error);
          }
        })
        .catch((error) => {
          console.error('Network error:', error);
        });
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
