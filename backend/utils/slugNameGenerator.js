import shopModel from "../models/shop_model.js";

const slugNameGen = async (shopName) => {
    const adjectives = ["baby", "sweetu", "janmooni", "bebo", "cutie", "kuchimuchi"];
    let randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)]
    let random = Math.floor(Math.random() * 1000)
    let slug = `${randomAdj}-${shopName}-${random}`
    let shopExists = await shopModel.findOne({ slug });
    while (shopExists) {
        randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)]
        random = Math.floor(Math.random() * 1000)
        slug = `${randomAdj}-${shopName}-${random}`
        shopExists = await shopModel.findOne({ slug });
    }
    return slug;
}

export default slugNameGen;