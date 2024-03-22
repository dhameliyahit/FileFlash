
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        showMessage("Please select a file.");
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        showMessage(`File uploaded successfully. Code: ${data.code}`);
    })
    .catch(error => {
        showMessage('Error uploading file.');
        console.error('Error:', error);
    });
}


function downloadFile() {
    const fileCode = document.getElementById('fileCode').value.trim(); // Trim any leading/trailing whitespace

    if (!fileCode) {
        showMessage("Please enter a code.");
        return;
    }

    // Construct the URL with the file code
    const downloadUrl = `/download?code=${encodeURIComponent(fileCode)}`;

    // Fetch the file with the provided code
    fetch(downloadUrl)
        .then(response => {
            if (response.ok) {
                return response.blob();
            } else {
                throw new Error('File not found');
            }
        })
        .then(blob => {
            // Create a temporary anchor element to trigger download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileCode}.zip`; // Set the download attribute with the correct extension
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            showMessage('File downloaded successfully.');
        })
        .catch(error => {
            showMessage('Error downloading file: File not found.');
            console.error('Error:', error);
        });
}




function showMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
}

