import { app, screen } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import dotenv from 'dotenv';

dotenv.config();

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = createWindow('main', {
    width: 500,
    minWidth: 500,
    maxWidth: 1500,
    height: height,
    minHeight: 600,
    maxHeight: 1200,
    x: width - 600,
    y: 0,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

