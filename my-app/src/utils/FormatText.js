export const formatText = (text) => {
    // Convertir *texto* en <strong>texto</strong>
    text = text?.replace(/\*(.*?)\*/g, '<h2 style="font-weight:bold">$1</h2>');
    
    // Eliminar texto entre los caracteres especiales 【 y 】
    text = text.replace(/【.*?】/g, '');

    // Convertir listas con números en listas ordenadas, sin duplicar números
 
    // Reemplazar imágenes en formato Markdown ![Texto Alt](URL) por etiquetas <img>
    text = text.replace(/!\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, 
        `<br><img src="$2" alt="$1" style="max-width: 50%; height: auto; margin-left: 10px;" /><br>`);

    text = text.replace(/<img(.*?)>/g, '<img$1 style="width: 50%; max-width: 50%; height: auto; margin-left: 10px;" />');
    // Reemplazar enlaces con el formato [Texto](url)
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    return text;
};
