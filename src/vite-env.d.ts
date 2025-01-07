/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_APP_DB_APIKEY: string;
    VITE_APP_DB_AUTHDOMAIN: string;
    VITE_APP_DB_DATABASE_URL: string;
    VITE_APP_DB_PROJECTID: string;
    VITE_APP_DB_STORAGE_BUCKET: string;
    VITE_APP_DB_MESSAGING_SENDERID: string;
    VITE_APP_DB_APPID: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  