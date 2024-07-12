const setImageURL = (doc)=>{
    const imageURL = `${process.env.BASE_URL}/categories/${doc.image}`
    doc.image =imageURL;
}

module.exports =setImageURL;