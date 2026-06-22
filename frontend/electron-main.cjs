const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let pythonProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: "Paşa Asansör ERP",
    autoHideMenuBar: true
  });

  // Eğer dev modundaysak localhost'u aç, yoksa build edilmiş index.html'i yükle
  const isDev = process.argv.includes('--dev');
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function startPythonBackend() {
  const venvPath = path.join(__dirname, '..', 'venv', 'Scripts');
  
  // Arka planda uvicorn başlatıyoruz
  pythonProcess = spawn(path.join(venvPath, 'uvicorn.exe'), ['main:app', '--host', '127.0.0.1', '--port', '8000'], {
    cwd: path.join(__dirname, '..')
  });

  pythonProcess.stdout.on('data', (data) => console.log(`Backend: ${data}`));
  pythonProcess.stderr.on('data', (data) => console.error(`Backend Hata: ${data}`));
}

app.whenReady().then(() => {
  startPythonBackend();
  // Python sunucusunun (FastAPI) hazır olması için 2 saniye bekle ve pencereyi aç
  setTimeout(createWindow, 2000);
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  // Uygulama kapanırken arka plandaki Python sunucusunu da kapat!
  if (pythonProcess) {
    pythonProcess.kill();
  }
});
