export function colorGenerator() {
    //const color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(60 + Math.random() * 20);
    const lightness = Math.floor(30 + Math.random() * 30);
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    console.log('hue: ', hue, 'saturation: ', saturation, 'lightness: ', lightness);
    return color;
}