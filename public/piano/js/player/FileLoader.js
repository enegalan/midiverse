import { getLoader } from "../ui/Loader.js"

export class FileLoader {
    static async loadSongFromURL(url, callback) {
        getLoader().setLoadMessage(`Loading Song from ${url}`);
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onload = function (event) {
                callback(event.target.result, url, () => {});
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.error(error);
        }
    }
}
