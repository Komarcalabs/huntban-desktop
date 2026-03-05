# Huntban Desktop - Pro Release Orchestrator 🚀

Este repositorio es el orquestador encargado de generar los builds oficiales para Windows y macOS del cliente Huntban, utilizando GitHub Actions para automatizar el proceso de empaquetado y firma.

## 🛠 Configuración Inicial (Solo una vez)

Para que el sistema funcione, debes configurar los siguientes **Secrets** en GitHub (Settings > Secrets and variables > Actions > Secrets):

1.  **`GITLAB_TOKEN`**: Tu Personal Access Token de GitLab con permisos de `read_repository`.
2.  **`TAURI_SIGNING_PRIVATE_KEY`**: El contenido de tu archivo de clave privada (`sign_private.txt`).
3.  **`TAURI_SIGNING_PRIVATE_KEY_PASSWORD`**: La contraseña de tu clave (ej: `huntban`).
4.  **`GITHUB_TOKEN`**: Se genera automáticamente, no necesitas añadirlo.

## 🚀 Flujo Profesional de Lanzamiento (Pro Release Flow)

Para lanzar una nueva versión oficial, ya no necesitas entrar en la carpeta del cliente. Todo se gestiona desde aquí:

### 1. Incrementar versión

Este comando actualiza el `package.json` local, hace un commit y crea un tag de Git automáticamente.

```bash
npm run bump -- patch  # o minor / major
```

### 2. Publicar en GitHub

Sube los cambios y el nuevo tag. El pipeline se encargará de inyectar esta versión en el cliente automáticamente y crear la Release.

```bash
git push origin main --tags
```

## 📦 ¿Qué sucede tras el Push?

1.  **Builds Automáticos**: GitHub activará máquinas virtuales de Windows y macOS.
2.  **Clonación Segura**: Se descargará la rama `upgrade` de `huntban-client` usando tu token.
3.  **GitHub Release (Permanente)**: Al terminar, se creará automáticamente una **Release** en este repositorio. A diferencia de los artifacts temporales de GitHub Actions (que expiran), los archivos en la sección **Releases** son permanentes y seguros para ser referenciados por tu backend.
4.  **Descargas e Info para el Updater**: Los instaladores (`.msi`, `.dmg`) y sus firmas (`.sig`) estarán disponibles allí. Tu backend puede usar estas URLs fijas para el sistema de auto-update.

---

_Desarrollado para Huntban por Komarcalabs._
