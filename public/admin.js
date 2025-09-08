const dropArea = document.getElementById('drop-area');
const imageInput = document.getElementById('image-input');
const uploadedPath = document.getElementById('uploaded-path');

dropArea.addEventListener('click', () => imageInput.click());

dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.style.borderColor = '#ff8040';
});

dropArea.addEventListener('dragleave', () => dropArea.style.borderColor = '#ccc');

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.style.borderColor = '#ccc';
  imageInput.files = e.dataTransfer.files;
  uploadedPath.textContent = e.dataTransfer.files[0].name;
});

// When form is submitted, the file will automatically be uploaded with multer
