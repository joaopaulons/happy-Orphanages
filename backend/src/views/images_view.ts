import Image from "../models/image";

export default {
    render(image: Image){
        return {
            id: image.id,
            url: `http://192.168.0.33:3333/uploads/${image.path}`,
        };
    },

    renderMany(images: Image[]){
        return images.map(images => this.render(images));
    }
}
